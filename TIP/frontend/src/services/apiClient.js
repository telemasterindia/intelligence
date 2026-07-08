const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function getFoundationStatus() {
  const response = await fetch(`${API_BASE_URL}/foundation`);
  if (!response.ok) throw new Error("Unable to load foundation status.");
  return response.json();
}

export async function detectCsvColumns(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/imports/detect-columns`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to detect CSV columns."));
  return response.json();
}

async function readErrorMessage(response, fallback) {
  try {
    const payload = await response.json();
    return payload?.error?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function uploadCsvImport({ file, mapping, duplicateStrategy, vendorName, dryRun }) {
  const formData = new FormData();
  formData.append("mapping", JSON.stringify(mapping));
  formData.append("duplicateStrategy", duplicateStrategy);
  formData.append("vendorName", vendorName);
  formData.append("dryRun", String(Boolean(dryRun)));
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/imports`, {
    method: "POST",
    headers: {
      "X-TIP-Dry-Run": String(Boolean(dryRun))
    },
    body: formData
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to import CSV."));
  return response.json();
}

export function getImportExportUrl(batchId, type) {
  return `${API_BASE_URL}/imports/${batchId}/export/${type}`;
}
