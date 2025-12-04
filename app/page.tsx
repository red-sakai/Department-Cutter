"use client";

import { useMemo, useState } from "react";

const DEPARTMENT_COLUMN = "Which department would you like to apply to as a committee member?";
const EMAIL_COLUMN = "Email Address";
const NAME_COLUMN = "Name";
const TECH_DEPARTMENT_COLUMN = "Which technology department do you want to apply to?";
const REQUIRED_COLUMNS = [
  DEPARTMENT_COLUMN,
  EMAIL_COLUMN,
  NAME_COLUMN,
  TECH_DEPARTMENT_COLUMN,
] as const;

const DEPARTMENTS = [
  "Technology Department",
  "Operations Department",
  "Creatives Department",
  "Marketing Department",
  "Relations Department: Public",
  "Relations Department: Community",
  "Administrative Department",
] as const;

const TECH_DEPARTMENTS = [
  "Cybersecurity",
  "Networking",
  "AI & Data Science",
  "Programming",
  "OS & IT",
] as const;

type Department = (typeof DEPARTMENTS)[number];
type TechDepartment = (typeof TECH_DEPARTMENTS)[number];
type ResultBucket = { csv: string; rows: number };
type DepartmentRow = {
  name: string;
  email: string;
  department: Department;
  tech?: string;
};

const isDepartment = (value: string | undefined | null): value is Department => {
  if (!value) {
    return false;
  }
  return (DEPARTMENTS as readonly string[]).includes(value);
};

const isTechDepartment = (value: string | undefined | null): value is TechDepartment => {
  if (!value) {
    return false;
  }
  return (TECH_DEPARTMENTS as readonly string[]).includes(value);
};

const createEmptyResults = (): Record<Department, ResultBucket | null> =>
  DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = null;
    return acc;
  }, {} as Record<Department, ResultBucket | null>);

const createEmptyTechResults = (): Record<TechDepartment, ResultBucket | null> =>
  TECH_DEPARTMENTS.reduce((acc, dept) => {
    acc[dept] = null;
    return acc;
  }, {} as Record<TechDepartment, ResultBucket | null>);

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(createEmptyResults);
  const [techResults, setTechResults] = useState(createEmptyTechResults);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const totalMatches = useMemo(() => {
    return DEPARTMENTS.reduce((sum, dept) => sum + (results[dept]?.rows ?? 0), 0);
  }, [results]);

  const totalTechMatches = useMemo(() => {
    return TECH_DEPARTMENTS.reduce((sum, dept) => sum + (techResults[dept]?.rows ?? 0), 0);
  }, [techResults]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setErrorMessage(null);

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsedRows = parseCsv(text);

        if (!parsedRows.length) {
          setResults(createEmptyResults());
          setTechResults(createEmptyTechResults());
          setErrorMessage("No rows detected in the uploaded CSV.");
          return;
        }

        const headerSet = new Set(Object.keys(parsedRows[0]));
        const missingColumns = REQUIRED_COLUMNS.filter((column) => !headerSet.has(column));

        if (missingColumns.length) {
          setResults(createEmptyResults());
          setTechResults(createEmptyTechResults());
          setErrorMessage(`Missing columns: ${missingColumns.join(", ")}`);
          return;
        }

        const grouped = DEPARTMENTS.reduce((acc, dept) => {
          acc[dept] = [] as DepartmentRow[];
          return acc;
        }, {} as Record<Department, DepartmentRow[]>);

        const techGrouped = TECH_DEPARTMENTS.reduce((acc, dept) => {
          acc[dept] = [] as string[][];
          return acc;
        }, {} as Record<TechDepartment, string[][]>);

        parsedRows.forEach((row) => {
          const selectedDepartment = row[DEPARTMENT_COLUMN]?.trim();
          if (!isDepartment(selectedDepartment)) {
            return;
          }

          const nameValue = row[NAME_COLUMN]?.trim() ?? "";
          const emailValue = row[EMAIL_COLUMN]?.trim() ?? "";
          const techValueRaw = row[TECH_DEPARTMENT_COLUMN]?.trim();
          const techValue = isTechDepartment(techValueRaw) ? techValueRaw : "";

          grouped[selectedDepartment].push({
            name: nameValue,
            email: emailValue,
            department: selectedDepartment,
            tech: techValue || undefined,
          });

          if (selectedDepartment === "Technology Department" && techValue) {
            techGrouped[techValue].push([nameValue, emailValue, techValue]);
          }
        });

        const finalized = DEPARTMENTS.reduce((acc, dept) => {
          const entries = grouped[dept];
          if (!entries.length) {
            acc[dept] = null;
          } else {
            const header =
              dept === "Technology Department"
                ? [NAME_COLUMN, EMAIL_COLUMN, DEPARTMENT_COLUMN, TECH_DEPARTMENT_COLUMN]
                : [NAME_COLUMN, EMAIL_COLUMN, DEPARTMENT_COLUMN];

            const csvLines = [
              header.join(","),
              ...entries.map((entry) => {
                const rowValues =
                  dept === "Technology Department"
                    ? [entry.name, entry.email, entry.department, entry.tech ?? ""]
                    : [entry.name, entry.email, entry.department];
                return rowValues.map(escapeForCsv).join(",");
              }),
            ];
            acc[dept] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<Department, ResultBucket | null>);

        const techFinalized = TECH_DEPARTMENTS.reduce((acc, dept) => {
          const entries = techGrouped[dept];
          if (!entries.length) {
            acc[dept] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, TECH_DEPARTMENT_COLUMN];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[dept] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<TechDepartment, ResultBucket | null>);

        setResults(finalized);
        setTechResults(techFinalized);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
        setResults(createEmptyResults());
        setTechResults(createEmptyTechResults());
        setErrorMessage("Unable to process the selected CSV. Please verify its format.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setResults(createEmptyResults());
      setTechResults(createEmptyTechResults());
      setErrorMessage("Failed to read the selected file.");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const triggerDownload = (label: string, payload: ResultBucket | null) => {
    if (!payload) {
      return;
    }

    const blob = new Blob([payload.csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${label.replace(/[^a-z0-9]+/gi, "-")}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (department: Department) => {
    triggerDownload(department, results[department]);
  };

  const handleTechDownload = (department: TechDepartment) => {
    triggerDownload(`Technology-${department}`, techResults[department]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/60 backdrop-blur">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Department Cutter</p>
          <h1 className="text-4xl font-semibold text-white">
            Split committee applications by department
          </h1>
          <p className="text-base text-slate-300">
            Upload the raw CSV export and download tidy files for each committee. Only rows that match the
            required department choices, names, and emails are preserved.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
          <label
            htmlFor="csv-input"
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-500/60 bg-slate-900/40 px-6 py-10 text-center transition hover:border-sky-400 hover:bg-slate-900/70"
          >
            <span className="text-xl font-medium text-white">Drop or choose your CSV</span>
            <span className="text-sm text-slate-400">
              {fileName ?? "Which department would you like to apply to as a committee member?"}
            </span>
            <span className="rounded-full bg-sky-500/20 px-4 py-1 text-xs uppercase tracking-widest text-sky-300">
              {isProcessing ? "Processing" : "Browse files"}
            </span>
          </label>
          <input
            id="csv-input"
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          {errorMessage && (
            <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
              {errorMessage}
            </p>
          )}
          {!errorMessage && isProcessing && (
            <p className="mt-4 text-sm text-slate-400">Crunching rows… hang tight.</p>
          )}
          {lastUpdated && !errorMessage && !isProcessing && (
            <p className="mt-4 text-sm text-slate-400">
              Generated {totalMatches} placements ({totalTechMatches} technology) • {lastUpdated.toLocaleString()}
            </p>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {DEPARTMENTS.map((department) => {
            const bucket = results[department];
            return (
              <article
                key={department}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-6"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-white">{department}</h2>
                  <p className="text-sm text-slate-400">
                    {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(department)}
                  disabled={!bucket}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  Download CSV
                </button>
              </article>
            );
          })}
        </section>

        <section className="space-y-4 rounded-2xl border border-sky-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Technology Department split</p>
            <h2 className="text-2xl font-semibold text-white">Download tech committee CSVs</h2>
            <p className="text-sm text-slate-300">
              Only rows where the main department is Technology and contain the follow-up selection are counted here.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {TECH_DEPARTMENTS.map((department) => {
              const bucket = techResults[department];
              return (
                <article
                  key={department}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">{department}</h3>
                    <p className="text-sm text-slate-400">
                      {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTechDownload(department)}
                    disabled={!bucket}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

type ParsedRow = Record<string, string>;

function parseCsv(text: string): ParsedRow[] {
  const rows: string[][] = [];
  let cell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      currentRow.push(cell);
      cell = "";
      continue;
    }

    if (char === '\r') {
      continue;
    }

    if (char === '\n') {
      currentRow.push(cell);
      rows.push(currentRow);
      currentRow = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  currentRow.push(cell);
  rows.push(currentRow);

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  const parsed: ParsedRow[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (row.every((value) => value.trim() === "")) {
      continue;
    }

    const record: ParsedRow = {};
    headers.forEach((header, index) => {
      record[header] = row[index]?.trim() ?? "";
    });
    parsed.push(record);
  }

  return parsed;
}

function escapeForCsv(value: string): string {
  if (value.includes('"')) {
    value = value.replace(/"/g, '""');
  }

  if (/[",\n]/.test(value)) {
    return `"${value}"`;
  }

  return value;
}
