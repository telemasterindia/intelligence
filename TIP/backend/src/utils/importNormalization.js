const STATE_NAMES = new Map([
  ["ALABAMA", "AL"],
  ["ALASKA", "AK"],
  ["ARIZONA", "AZ"],
  ["ARKANSAS", "AR"],
  ["CALIFORNIA", "CA"],
  ["COLORADO", "CO"],
  ["CONNECTICUT", "CT"],
  ["DELAWARE", "DE"],
  ["FLORIDA", "FL"],
  ["GEORGIA", "GA"],
  ["HAWAII", "HI"],
  ["IDAHO", "ID"],
  ["ILLINOIS", "IL"],
  ["INDIANA", "IN"],
  ["IOWA", "IA"],
  ["KANSAS", "KS"],
  ["KENTUCKY", "KY"],
  ["LOUISIANA", "LA"],
  ["MAINE", "ME"],
  ["MARYLAND", "MD"],
  ["MASSACHUSETTS", "MA"],
  ["MICHIGAN", "MI"],
  ["MINNESOTA", "MN"],
  ["MISSISSIPPI", "MS"],
  ["MISSOURI", "MO"],
  ["MONTANA", "MT"],
  ["NEBRASKA", "NE"],
  ["NEVADA", "NV"],
  ["NEW HAMPSHIRE", "NH"],
  ["NEW JERSEY", "NJ"],
  ["NEW MEXICO", "NM"],
  ["NEW YORK", "NY"],
  ["NORTH CAROLINA", "NC"],
  ["NORTH DAKOTA", "ND"],
  ["OHIO", "OH"],
  ["OKLAHOMA", "OK"],
  ["OREGON", "OR"],
  ["PENNSYLVANIA", "PA"],
  ["RHODE ISLAND", "RI"],
  ["SOUTH CAROLINA", "SC"],
  ["SOUTH DAKOTA", "SD"],
  ["TENNESSEE", "TN"],
  ["TEXAS", "TX"],
  ["UTAH", "UT"],
  ["VERMONT", "VT"],
  ["VIRGINIA", "VA"],
  ["WASHINGTON", "WA"],
  ["WEST VIRGINIA", "WV"],
  ["WISCONSIN", "WI"],
  ["WYOMING", "WY"]
]);

const STATE_CODES = new Set([...STATE_NAMES.values()]);

export function cleanHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function detectImportMapping(headers) {
  const candidates = {
    firstName: ["firstname", "fname", "first"],
    lastName: ["lastname", "lname", "last", "surname"],
    phone: ["phone", "phonenumber", "mobile", "cell", "telephone"],
    email: ["email", "emailaddress"],
    address: ["address", "street", "address1", "addressline1"],
    city: ["city", "town"],
    state: ["state", "st"],
    zip: ["zip", "zipcode", "postal", "postalcode"],
    recordDate: ["recorddate", "date", "createddate", "leaddate", "importdate"],
    vendor: ["vendor", "source", "leadvendor", "provider"]
  };

  const normalizedHeaders = headers.map((header) => [header, cleanHeader(header)]);
  return Object.fromEntries(
    Object.entries(candidates).map(([field, names]) => {
      const match = normalizedHeaders.find(([, normalized]) => names.includes(normalized));
      return [field, match ? match[0] : ""];
    })
  );
}

export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return "";
}

export function normalizeState(value) {
  const text = String(value || "").trim().toUpperCase();
  if (!text) return "";
  if (STATE_CODES.has(text)) return text;
  return STATE_NAMES.get(text) || "";
}

export function normalizeZip(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length >= 5) return digits.slice(0, 5);
  return "";
}

export function parseRecordDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDataAgeBucket(recordDate, now = new Date()) {
  if (!recordDate) return "noDate";
  const ageDays = Math.max(0, (now.getTime() - recordDate.getTime()) / 86400000);
  if (ageDays < 183) return "under6Months";
  if (ageDays < 365) return "sixToTwelveMonths";
  if (ageDays < 730) return "oneToTwoYears";
  return "twoPlusYears";
}

export function validateNormalizedRecord(record) {
  const errors = [];
  if (!record.phoneNormalized) errors.push("Phone is missing or is not a valid US phone number.");
  if (!record.zipNormalized) errors.push("ZIP is missing or is not at least 5 digits.");
  if (!record.stateNormalized) errors.push("State is missing or is not a valid US state.");
  return errors;
}
