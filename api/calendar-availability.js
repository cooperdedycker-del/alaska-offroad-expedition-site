import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return res.status(500).json({
        error: "Missing Google Calendar environment variables.",
        hasClientEmail: Boolean(clientEmail),
        hasPrivateKey: Boolean(privateKey),
        hasCalendarId: Boolean(calendarId),
      });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    await auth.authorize();

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const now = new Date();

const rangesToQuery = [];

for (let i = 0; i < 12; i += 3) {
  const start = new Date(now);
  start.setMonth(start.getMonth() + i);

  const end = new Date(now);
  end.setMonth(end.getMonth() + i + 3);

  rangesToQuery.push({ start, end });
}

let busy = [];

for (const range of rangesToQuery) {
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: range.start.toISOString(),
      timeMax: range.end.toISOString(),
      items: [{ id: calendarId }],
    },
  });

  const calendarBusy =
    response.data.calendars?.[calendarId]?.busy?.map((item) => ({
      start: item.start,
      end: item.end,
    })) || [];

  busy.push(...calendarBusy);
}

    return res.status(200).json({ busy });
  } catch (error) {
    console.error("Calendar availability error:", error);

    return res.status(500).json({
      error: "Failed to fetch calendar availability.",
      details: error.message,
    });
  }
}