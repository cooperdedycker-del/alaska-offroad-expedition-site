import { google } from "googleapis";

const ALASKA_TIME_ZONE = "America/Anchorage";

function getAlaskaDateString(dateValue) {
  const date = new Date(dateValue);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: ALASKA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getDatesBetween(startDateString, endDateString) {
  const dates = [];

  const current = new Date(`${startDateString}T00:00:00Z`);
  const end = new Date(`${endDateString}T00:00:00Z`);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    const privateKey =
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return res.status(500).json({
        error: "Missing Google Calendar environment variables.",
      });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });

    await auth.authorize();

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const now = new Date();
    const rangesToQuery = [];

    /*
     * Check the next 12 months in four
     * 3-month chunks.
     */
    for (let i = 0; i < 12; i += 3) {
      const start = new Date(now);
      start.setMonth(start.getMonth() + i);

      const end = new Date(now);
      end.setMonth(end.getMonth() + i + 3);

      rangesToQuery.push({
        start,
        end,
      });
    }

    let busy = [];

    for (const range of rangesToQuery) {
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: range.start.toISOString(),
          timeMax: range.end.toISOString(),

          timeZone: ALASKA_TIME_ZONE,

          items: [
            {
              id: calendarId,
            },
          ],
        },
      });

      const calendarBusy =
        response.data.calendars?.[calendarId]?.busy?.map(
          (item) => ({
            start: item.start,
            end: item.end,
          })
        ) || [];

      busy.push(...calendarBusy);
    }

    /*
     * Convert Google busy ranges into exact
     * Alaska calendar dates.
     *
     * Google end times are treated as exclusive,
     * so subtract 1 millisecond before finding
     * the ending Alaska date.
     */
    const blockedDateSet = new Set();

    busy.forEach((range) => {
      if (!range.start || !range.end) {
        return;
      }

      const startDate =
        getAlaskaDateString(range.start);

      const endMilliseconds =
        new Date(range.end).getTime() - 1;

      const endDate =
        getAlaskaDateString(
          new Date(endMilliseconds)
        );

      const dates = getDatesBetween(
        startDate,
        endDate
      );

      dates.forEach((date) =>
        blockedDateSet.add(date)
      );
    });

    const blockedDates = Array.from(
      blockedDateSet
    ).sort();

    return res.status(200).json({
      monthsChecked: 12,
      chunksChecked: rangesToQuery.length,

      /*
       * Keep this for the existing Trip Builder.
       */
      busy,

      /*
       * New package booking system uses this.
       */
      blockedDates,
    });
  } catch (error) {
    console.error(
      "Calendar availability error:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to fetch calendar availability.",
      details: error.message,
    });
  }
}