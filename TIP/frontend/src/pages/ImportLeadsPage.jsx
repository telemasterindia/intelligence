import { useMemo, useState } from "react";
import { detectCsvColumns, getImportExportUrl, uploadCsvImport } from "../services/apiClient";

const FIELD_LABELS = {
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  email: "Email",
  address: "Address",
  city: "City",
  state: "State",
  zip: "ZIP",
  recordDate: "Record Date",
  vendor: "Vendor"
};

const REQUIRED_FIELDS = new Set(["phone", "state", "zip"]);

function SummaryValue({ label, value }) {
  return (
    <div className="rounded border border-slate-800 bg-tip-background p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function ImportLeadsPage() {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [previewRows, setPreviewRows] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [duplicateStrategy, setDuplicateStrategy] = useState("keep_first");
  const [dryRun, setDryRun] = useState(true);
  const [status, setStatus] = useState("Select a CSV file to begin.");
  const [isBusy, setIsBusy] = useState(false);
  const [result, setResult] = useState(null);
  const canImport = useMemo(() => file && mapping.phone && mapping.state && mapping.zip && !isBusy, [file, mapping, isBusy]);
  const canDryRun = useMemo(() => file && headers.length && !isBusy, [file, headers.length, isBusy]);
  const canSubmit = dryRun ? canDryRun : canImport;

  async function handleFileChange(event) {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    setHeaders([]);
    setMapping({});
    setPreviewRows([]);
    setResult(null);
    if (!selected) return;

    setIsBusy(true);
    setStatus("Detecting columns...");
    try {
      const detected = await detectCsvColumns(selected);
      setHeaders(detected.headers);
      setMapping(detected.mapping);
      setPreviewRows(detected.previewRows || []);
      setStatus("Columns detected. Review the preview and mapping before import.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleImport(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsBusy(true);
    setStatus(dryRun ? "Running dry run. No records will be saved..." : "Importing CSV. Large files may take several minutes...");
    setResult(null);
    try {
      const imported = await uploadCsvImport({ file, mapping, duplicateStrategy, vendorName, dryRun });
      setResult(imported);
      setStatus(dryRun ? "Dry run complete. No database records were saved." : "Import complete.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded border border-slate-800 bg-tip-panel p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tip-accent">Sprint 1 Import Engine</p>
        <h1 className="text-2xl font-semibold text-white">Import Leads</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Upload a CSV, confirm column mapping, choose duplicate handling, and import clean records into PostgreSQL.
        </p>
      </div>

      <form className="rounded border border-slate-800 bg-tip-panel p-6" onSubmit={handleImport}>
        <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">CSV File</span>
            <input
              accept=".csv,text/csv"
              className="mt-2 block w-full rounded border border-slate-700 bg-tip-background px-3 py-2 text-sm text-slate-200 file:mr-4 file:rounded file:border-0 file:bg-tip-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-tip-background"
              disabled={isBusy}
              onChange={handleFileChange}
              type="file"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Batch Vendor</span>
            <input
              className="mt-2 w-full rounded border border-slate-700 bg-tip-background px-3 py-2 text-sm text-slate-200"
              onChange={(event) => setVendorName(event.target.value)}
              placeholder="Optional"
              type="text"
              value={vendorName}
            />
          </label>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-200">Duplicate Phone Handling</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {[
              ["keep_first", "Keep First"],
              ["keep_latest", "Keep Latest"],
              ["keep_all", "Keep All"]
            ].map(([value, label]) => (
              <label className="flex items-center gap-2 rounded border border-slate-700 px-3 py-2 text-sm text-slate-300" key={value}>
                <input
                  checked={duplicateStrategy === value}
                  disabled={isBusy}
                  onChange={() => setDuplicateStrategy(value)}
                  type="radio"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-200">Column Mapping</p>
            <p className="text-xs text-slate-500">Phone, State, and ZIP are required.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(FIELD_LABELS).map(([field, label]) => (
              <label className="block" key={field}>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  {label} {REQUIRED_FIELDS.has(field) ? "*" : ""}
                </span>
                <select
                  className="mt-1 w-full rounded border border-slate-700 bg-tip-background px-3 py-2 text-sm text-slate-200"
                  disabled={!headers.length || isBusy}
                  onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}
                  value={mapping[field] || ""}
                >
                  <option value="">Not mapped</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded border border-slate-800 bg-tip-background p-4">
          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              checked={dryRun}
              className="mt-1"
              disabled={isBusy}
              onChange={(event) => setDryRun(event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="block font-medium text-slate-100">Dry Run mode</span>
              Analyze the CSV and show the import summary without saving vendors, batches, leads, validations, or audit records.
            </span>
          </label>
        </div>

        {previewRows.length ? (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-200">Import Preview</p>
              <p className="text-xs text-slate-500">First 25 rows</p>
            </div>
            <div className="overflow-x-auto rounded border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-tip-background text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    {headers.map((header) => (
                      <th className="whitespace-nowrap px-3 py-2 font-medium" key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {previewRows.map((row, index) => (
                    <tr key={`${index}-${headers[0] || "row"}`}>
                      {headers.map((header) => (
                        <td className="max-w-64 truncate px-3 py-2" key={header} title={row[header]}>
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            className="rounded bg-tip-accent px-4 py-2 text-sm font-semibold text-tip-background disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            type="submit"
          >
            {isBusy ? "Working..." : dryRun ? "Run Dry Run" : "Import CSV"}
          </button>
          <p className="text-sm text-slate-400">{status}</p>
        </div>
      </form>

      {result ? (
        <div className="rounded border border-slate-800 bg-tip-panel p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Import Summary</h2>
              <p className="text-sm text-slate-400">Batch Name: {result.batchName}</p>
              <p className="text-sm text-slate-400">
                {result.dryRun ? "Dry Run: no database records saved." : `Batch ID: ${result.batchId}`}
              </p>
            </div>
            {!result.dryRun ? (
              <div className="flex flex-wrap gap-2">
                <a className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200" href={getImportExportUrl(result.batchId, "clean")}>Clean Records</a>
                <a className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200" href={getImportExportUrl(result.batchId, "duplicate")}>Duplicate Records</a>
                <a className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200" href={getImportExportUrl(result.batchId, "invalid")}>Invalid Records</a>
              </div>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryValue label="Total Records" value={result.summary.totalRecords} />
            <SummaryValue label="Imported" value={result.summary.imported} />
            <SummaryValue label="Valid Phones" value={result.summary.validPhones} />
            <SummaryValue label="Invalid Phones" value={result.summary.invalidPhones} />
            <SummaryValue label="Duplicate Phones" value={result.summary.duplicatePhones} />
            <SummaryValue label="Missing ZIP" value={result.summary.missingZip} />
            <SummaryValue label="Missing State" value={result.summary.missingState} />
          </div>
          <h3 className="mt-6 text-sm font-semibold text-white">Data Age Distribution</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryValue label="<6 Months" value={result.summary.dataAgeDistribution.under6Months} />
            <SummaryValue label="6-12 Months" value={result.summary.dataAgeDistribution.sixToTwelveMonths} />
            <SummaryValue label="1-2 Years" value={result.summary.dataAgeDistribution.oneToTwoYears} />
            <SummaryValue label="2+ Years" value={result.summary.dataAgeDistribution.twoPlusYears} />
            <SummaryValue label="No Date" value={result.summary.dataAgeDistribution.noDate} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
