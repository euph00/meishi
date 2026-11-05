// Elapsed means past, never proof of attendance or payment.
function isoDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid event date: ${value}`);
  }
  return value;
}
function localDay(date, timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year:'numeric', month:'2-digit', day:'2-digit' }).format(date);
}
export function rolloverEvents(content, now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Invalid rollover clock');
  if (!Array.isArray(content.ticker) || !Array.isArray(content.pastEvents)) throw new Error('Event arrays required');
  const ticker = [], pastEvents = [...content.pastEvents];
  const key = e => JSON.stringify([e.title, e.date, e.endDate ?? e.date]);
  const archived = new Set(pastEvents.map(key));
  for (const event of content.ticker) {
    if (!event || typeof event.title !== 'string' || !event.title.trim()) throw new Error('Event title required');
    const date = isoDay(event.date), lastDay = isoDay(event.endDate ?? event.date);
    if (lastDay < date) throw new Error('Event endDate precedes start');
    const zone = event.timeZone ?? 'Asia/Tokyo';
    const today = localDay(now, zone); // Also validates the IANA zone.
    let elapsed = lastDay < today;
    if (event.endsAt !== undefined) {
      if (typeof event.endsAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(event.endsAt)) {
        throw new Error('endsAt needs a full timestamp and explicit offset');
      }
      isoDay(event.endsAt.slice(0,10));
      const end = new Date(event.endsAt);
      if (!Number.isFinite(end.getTime()) || localDay(end,zone) !== lastDay) throw new Error('endsAt must fall on final event day');
      elapsed = end.getTime() <= now.getTime();
    }
    if (!elapsed) ticker.push(event);
    else if (!archived.has(key(event))) { pastEvents.push(event); archived.add(key(event)); }
  }
  return { ...content, ticker, pastEvents };
}
