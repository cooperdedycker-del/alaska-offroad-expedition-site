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
const oneYearOut = new Date(now);
oneYearOut.setMonth(oneYearOut.getMonth() + 6);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: oneYearOut.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busy =
      response.data.calendars?.[calendarId]?.busy?.map((range) => ({
        start: range.start,
        end: range.end,
      })) || [];

    return res.status(200).json({ busy });
  } catch (error) {
    console.error("Calendar availability error:", error);

    return res.status(500).json({
      error: "Failed to fetch calendar availability.",
      details: error.message,
    });
  }
}