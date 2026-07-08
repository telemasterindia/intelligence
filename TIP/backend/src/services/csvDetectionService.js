import Busboy from "busboy";
import { parse } from "csv-parse";
import { detectImportMapping } from "../utils/importNormalization.js";

export function detectCsvColumns(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    let settled = false;

    function finish(result) {
      if (settled) return;
      settled = true;
      resolve(result);
    }

    busboy.on("file", (_field, file) => {
      const parser = parse({ bom: true, to_line: 26, relax_column_count: true });
      let headers = null;
      const previewRows = [];

      parser.on("readable", () => {
        let row;
        while ((row = parser.read()) !== null) {
          if (!headers) {
            headers = row;
            continue;
          }
          previewRows.push(
            Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))
          );
        }
      });

      parser.on("end", () => {
        if (headers) {
          file.resume();
          finish({
            headers,
            mapping: detectImportMapping(headers),
            previewRows
          });
        }
      });

      parser.on("error", reject);
      file.pipe(parser);
    });

    busboy.on("error", reject);
    busboy.on("finish", () => {
      if (!settled) reject(new Error("No CSV file was uploaded."));
    });

    req.pipe(busboy);
  });
}
