export const HIRE_ENQUIRY_TYPE = "EQUIPMENT HIRE";
export const HIRE_NOT_SURE_VALUE = "not-sure";
export const HIRE_NOT_SURE_LABEL = "Not sure / need advice";

export function formatHireDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(year, month - 1, day).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function hireEquipmentLabel(
  equipmentId: string,
  units: { id: string; title: string }[]
): string {
  if (!equipmentId || equipmentId === HIRE_NOT_SURE_VALUE) return HIRE_NOT_SURE_LABEL;
  return units.find((unit) => unit.id === equipmentId)?.title ?? HIRE_NOT_SURE_LABEL;
}

export function buildHireEnquiryMessage(input: {
  equipmentTitle: string;
  startDate: string;
  endDate: string;
  longTerm: boolean;
  notes: string;
}): string {
  const period = input.longTerm
    ? `Long-term from ${formatHireDate(input.startDate)}`
    : `${formatHireDate(input.startDate)} to ${formatHireDate(input.endDate)}`;
  const notes = input.notes.trim() || "(none)";

  return [
    "Equipment hire enquiry",
    "",
    `Equipment: ${input.equipmentTitle}`,
    `Hire period: ${period}`,
    "",
    "Notes:",
    notes,
  ].join("\n");
}

export function hirePeriodValid(input: {
  startDate: string;
  endDate: string;
  longTerm: boolean;
}): string | null {
  if (!input.startDate) return "Please choose a start date.";
  if (input.longTerm) return null;
  if (!input.endDate) return "Please choose an end date, or select long-term hire.";
  if (input.endDate < input.startDate) return "End date must be on or after the start date.";
  return null;
}
