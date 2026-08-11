const SLOT_MINUTES = 5;
const LEAD_MINUTES = 20;
const MAX_SLOTS = 48;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatReadyTimeLabel(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** Слоты готовности: +20 мин от сейчас, шаг 5 мин. */
export function buildReadyTimeSlots(now = new Date()): string[] {
  const start = new Date(now);
  start.setMinutes(start.getMinutes() + LEAD_MINUTES, 0, 0);

  const remainder = start.getMinutes() % SLOT_MINUTES;
  if (remainder !== 0) {
    start.setMinutes(start.getMinutes() + (SLOT_MINUTES - remainder));
  }

  const end = new Date(start);
  end.setHours(23, 55, 0, 0);

  const slots: string[] = [];
  const cursor = new Date(start);

  while (slots.length < MAX_SLOTS && cursor <= end) {
    slots.push(formatReadyTimeLabel(cursor));
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}

export function defaultReadyTimeSlot(now = new Date()): string {
  const slots = buildReadyTimeSlots(now);
  return slots[0] ?? formatReadyTimeLabel(now);
}
