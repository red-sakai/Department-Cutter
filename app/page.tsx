"use client";

import { useMemo, useState } from "react";

const DEPARTMENT_COLUMN = "Which department would you like to apply to as a committee member?";
const EMAIL_COLUMN = "Email Address";
const NAME_COLUMN = "Name";
const TECH_DEPARTMENT_COLUMN = "Which technology department do you want to apply to?";
const TECH_ROLE_COLUMN =
  "Would you like to apply as a committee member to other department, or would you prefer to join as a Technology Department cadet?";
const OPERATIONS_COMMITTEE_COLUMNS = [
  "Which committee would you like to apply for?",
  "What position would you like to apply for?",
] as const;
const OPERATIONS_PROGRAM_ROLE_COLUMNS = [
  "What position would you like to apply for? (2)",
  "What position would you like to apply for? (Programs)",
] as const;
const OPERATIONS_COMMITTEE_EXPORT_HEADER = "What position would you like to apply for?";
const OPERATIONS_PROGRAM_ROLE_EXPORT_HEADER = "What position would you like to apply for? (Programs)";

const REQUIRED_COLUMN_GROUPS = [
  { label: DEPARTMENT_COLUMN, columns: [DEPARTMENT_COLUMN] as const },
  { label: EMAIL_COLUMN, columns: [EMAIL_COLUMN] as const },
  { label: NAME_COLUMN, columns: [NAME_COLUMN] as const },
  { label: TECH_DEPARTMENT_COLUMN, columns: [TECH_DEPARTMENT_COLUMN] as const },
  { label: TECH_ROLE_COLUMN, columns: [TECH_ROLE_COLUMN] as const },
  {
    label: OPERATIONS_COMMITTEE_EXPORT_HEADER,
    columns: OPERATIONS_COMMITTEE_COLUMNS,
  },
  {
    label: OPERATIONS_PROGRAM_ROLE_EXPORT_HEADER,
    columns: OPERATIONS_PROGRAM_ROLE_COLUMNS,
  },
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

const TECH_ROLE_OPTIONS = ["Cadet Member only", "Committee Member"] as const;
const OPERATIONS_COMMITTEE_OPTIONS = ["Operations Committtee", "Programs Committee"] as const;
const OPERATIONS_PROGRAM_ROLES = [
  "Host Coordinators",
  "Hosts",
  "Program Managers",
  "Technical Coordinators",
] as const;

type Department = (typeof DEPARTMENTS)[number];
type TechDepartment = (typeof TECH_DEPARTMENTS)[number];
type TechRole = (typeof TECH_ROLE_OPTIONS)[number];
type OperationsCommittee = (typeof OPERATIONS_COMMITTEE_OPTIONS)[number];
type OperationsProgramRole = (typeof OPERATIONS_PROGRAM_ROLES)[number];
type ResultBucket = { csv: string; rows: number };
type DepartmentRow = {
  name: string;
  email: string;
  department: Department;
  techDepartment?: TechDepartment;
  techRole?: TechRole;
  operationsCommittee?: OperationsCommittee;
  operationsProgramRole?: OperationsProgramRole;
};

const OPERATIONS_PROGRAM_ROLE_ALIASES: Record<OperationsProgramRole, readonly string[]> = {
  "Host Coordinators": ["Host Coordinator"],
  Hosts: ["Host"],
  "Program Managers": ["Program Manager"],
  "Technical Coordinators": ["Technical Coordinator"],
};

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFKD");

const normalizeChoice = <T extends readonly string[]>(
  value: string | undefined | null,
  choices: T
): T[number] | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = normalizeText(value);
  return choices.find((choice) => normalizeText(choice) === normalized) as T[number] | undefined;
};

const toDepartment = (value: string | undefined | null): Department | undefined =>
  normalizeChoice(value, DEPARTMENTS);

const toTechDepartment = (value: string | undefined | null): TechDepartment | undefined =>
  normalizeChoice(value, TECH_DEPARTMENTS);

const toTechRole = (value: string | undefined | null): TechRole | undefined =>
  normalizeChoice(value, TECH_ROLE_OPTIONS);

const toOperationsCommittee = (
  value: string | undefined | null
): OperationsCommittee | undefined => normalizeChoice(value, OPERATIONS_COMMITTEE_OPTIONS);

const toOperationsProgramRole = (
  value: string | undefined | null
): OperationsProgramRole | undefined => {
  const directMatch = normalizeChoice(value, OPERATIONS_PROGRAM_ROLES);
  if (directMatch || !value) {
    return directMatch;
  }

  const normalized = normalizeText(value);
  for (const role of Object.keys(OPERATIONS_PROGRAM_ROLE_ALIASES) as OperationsProgramRole[]) {
    const aliases = OPERATIONS_PROGRAM_ROLE_ALIASES[role];
    if (aliases.some((alias) => normalizeText(alias) === normalized)) {
      return role;
    }
  }

  return undefined;
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

const createEmptyTechRoleResults = (): Record<TechRole, ResultBucket | null> =>
  TECH_ROLE_OPTIONS.reduce((acc, role) => {
    acc[role] = null;
    return acc;
  }, {} as Record<TechRole, ResultBucket | null>);

const createEmptyOperationsResults = (): Record<OperationsCommittee, ResultBucket | null> =>
  OPERATIONS_COMMITTEE_OPTIONS.reduce((acc, option) => {
    acc[option] = null;
    return acc;
  }, {} as Record<OperationsCommittee, ResultBucket | null>);

const createEmptyOperationsProgramResults = (): Record<OperationsProgramRole, ResultBucket | null> =>
  OPERATIONS_PROGRAM_ROLES.reduce((acc, role) => {
    acc[role] = null;
    return acc;
  }, {} as Record<OperationsProgramRole, ResultBucket | null>);

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(createEmptyResults);
  const [techResults, setTechResults] = useState(createEmptyTechResults);
  const [techRoleResults, setTechRoleResults] = useState(createEmptyTechRoleResults);
  const [operationsResults, setOperationsResults] = useState(createEmptyOperationsResults);
  const [operationsProgramResults, setOperationsProgramResults] = useState(
    createEmptyOperationsProgramResults
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const totalMatches = useMemo(() => {
    return DEPARTMENTS.reduce((sum, dept) => sum + (results[dept]?.rows ?? 0), 0);
  }, [results]);

  const totalTechMatches = useMemo(() => {
    return TECH_DEPARTMENTS.reduce((sum, dept) => sum + (techResults[dept]?.rows ?? 0), 0);
  }, [techResults]);

  const totalTechRoleMatches = useMemo(() => {
    return TECH_ROLE_OPTIONS.reduce((sum, role) => sum + (techRoleResults[role]?.rows ?? 0), 0);
  }, [techRoleResults]);

  const totalOperationsCommitteeMatches = useMemo(() => {
    return OPERATIONS_COMMITTEE_OPTIONS.reduce(
      (sum, option) => sum + (operationsResults[option]?.rows ?? 0),
      0
    );
  }, [operationsResults]);

  const totalOperationsProgramMatches = useMemo(() => {
    return OPERATIONS_PROGRAM_ROLES.reduce(
      (sum, role) => sum + (operationsProgramResults[role]?.rows ?? 0),
      0
    );
  }, [operationsProgramResults]);

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
          setTechRoleResults(createEmptyTechRoleResults());
          setOperationsResults(createEmptyOperationsResults());
          setOperationsProgramResults(createEmptyOperationsProgramResults());
          setErrorMessage("No rows detected in the uploaded CSV.");
          return;
        }

        const headerSet = new Set(Object.keys(parsedRows[0]));
        const missingColumns = REQUIRED_COLUMN_GROUPS.filter(
          ({ columns }) => !columns.some((column) => headerSet.has(column))
        ).map((group) => group.label);

        if (missingColumns.length) {
          setResults(createEmptyResults());
          setTechResults(createEmptyTechResults());
          setTechRoleResults(createEmptyTechRoleResults());
          setOperationsResults(createEmptyOperationsResults());
          setOperationsProgramResults(createEmptyOperationsProgramResults());
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

        const techRoleGrouped = TECH_ROLE_OPTIONS.reduce((acc, role) => {
          acc[role] = [] as string[][];
          return acc;
        }, {} as Record<TechRole, string[][]>);

        const operationsGrouped = OPERATIONS_COMMITTEE_OPTIONS.reduce((acc, option) => {
          acc[option] = [] as string[][];
          return acc;
        }, {} as Record<OperationsCommittee, string[][]>);

        const operationsProgramGrouped = OPERATIONS_PROGRAM_ROLES.reduce((acc, role) => {
          acc[role] = [] as string[][];
          return acc;
        }, {} as Record<OperationsProgramRole, string[][]>);

        parsedRows.forEach((row) => {
          const selectedDepartment = toDepartment(getColumnValue(row, [DEPARTMENT_COLUMN] as const));
          if (!selectedDepartment) {
            return;
          }

          const nameValue = row[NAME_COLUMN]?.trim() ?? "";
          const emailValue = row[EMAIL_COLUMN]?.trim() ?? "";
          const techValue = toTechDepartment(getColumnValue(row, [TECH_DEPARTMENT_COLUMN] as const));
          const roleValue = toTechRole(getColumnValue(row, [TECH_ROLE_COLUMN] as const));
          const operationsValue = toOperationsCommittee(getColumnValue(row, OPERATIONS_COMMITTEE_COLUMNS));
          const operationsProgramValue = toOperationsProgramRole(
            getColumnValue(row, OPERATIONS_PROGRAM_ROLE_COLUMNS)
          );

          grouped[selectedDepartment].push({
            name: nameValue,
            email: emailValue,
            department: selectedDepartment,
            techDepartment: techValue,
            techRole: roleValue,
            operationsCommittee: operationsValue,
            operationsProgramRole: operationsProgramValue,
          });

          if (selectedDepartment === "Technology Department" && techValue) {
            techGrouped[techValue].push([nameValue, emailValue, techValue]);
          }

          if (selectedDepartment === "Technology Department" && roleValue) {
            techRoleGrouped[roleValue].push([nameValue, emailValue, techValue ?? "", roleValue]);
          }

          if (selectedDepartment === "Operations Department" && operationsValue) {
            operationsGrouped[operationsValue].push([nameValue, emailValue, operationsValue]);
          }

          if (
            selectedDepartment === "Operations Department" &&
            operationsValue === "Programs Committee" &&
            operationsProgramValue
          ) {
            operationsProgramGrouped[operationsProgramValue].push([
              nameValue,
              emailValue,
              operationsProgramValue,
            ]);
          }
        });

        const finalized = DEPARTMENTS.reduce((acc, dept) => {
          const entries = grouped[dept];
          if (!entries.length) {
            acc[dept] = null;
          } else {
            const header = (() => {
              if (dept === "Technology Department") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  TECH_DEPARTMENT_COLUMN,
                  TECH_ROLE_COLUMN,
                ];
              }
              if (dept === "Operations Department") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  OPERATIONS_COMMITTEE_EXPORT_HEADER,
                  OPERATIONS_PROGRAM_ROLE_EXPORT_HEADER,
                ];
              }
              return [NAME_COLUMN, EMAIL_COLUMN, DEPARTMENT_COLUMN];
            })();

            const csvLines = [
              header.join(","),
              ...entries.map((entry) => {
                const rowValues = (() => {
                  if (dept === "Technology Department") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.techDepartment ?? "",
                      entry.techRole ?? "",
                    ];
                  }
                  if (dept === "Operations Department") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.operationsCommittee ?? "",
                      entry.operationsProgramRole ?? "",
                    ];
                  }
                  return [entry.name, entry.email, entry.department];
                })();
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

        const techRoleFinalized = TECH_ROLE_OPTIONS.reduce((acc, role) => {
          const entries = techRoleGrouped[role];
          if (!entries.length) {
            acc[role] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, TECH_DEPARTMENT_COLUMN, TECH_ROLE_COLUMN];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[role] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<TechRole, ResultBucket | null>);

        const operationsFinalized = OPERATIONS_COMMITTEE_OPTIONS.reduce((acc, option) => {
          const entries = operationsGrouped[option];
          if (!entries.length) {
            acc[option] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, OPERATIONS_COMMITTEE_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[option] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<OperationsCommittee, ResultBucket | null>);

        const operationsProgramFinalized = OPERATIONS_PROGRAM_ROLES.reduce((acc, role) => {
          const entries = operationsProgramGrouped[role];
          if (!entries.length) {
            acc[role] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, OPERATIONS_PROGRAM_ROLE_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[role] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<OperationsProgramRole, ResultBucket | null>);

        setResults(finalized);
        setTechResults(techFinalized);
        setTechRoleResults(techRoleFinalized);
        setOperationsResults(operationsFinalized);
        setOperationsProgramResults(operationsProgramFinalized);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
        setResults(createEmptyResults());
        setTechResults(createEmptyTechResults());
        setTechRoleResults(createEmptyTechRoleResults());
        setOperationsResults(createEmptyOperationsResults());
        setOperationsProgramResults(createEmptyOperationsProgramResults());
        setErrorMessage("Unable to process the selected CSV. Please verify its format.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setResults(createEmptyResults());
      setTechResults(createEmptyTechResults());
      setTechRoleResults(createEmptyTechRoleResults());
      setOperationsResults(createEmptyOperationsResults());
      setOperationsProgramResults(createEmptyOperationsProgramResults());
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

  const handleTechRoleDownload = (role: TechRole) => {
    triggerDownload(`Technology-${role}`, techRoleResults[role]);
  };

  const handleOperationsDownload = (option: OperationsCommittee) => {
    triggerDownload(`Operations-${option}`, operationsResults[option]);
  };

  const handleOperationsProgramDownload = (role: OperationsProgramRole) => {
    triggerDownload(`Operations-Programs-${role}`, operationsProgramResults[role]);
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
              Generated {totalMatches} placements ({totalTechMatches} technology • {totalTechRoleMatches} tech pathway •
              {totalOperationsCommitteeMatches} ops committee • {totalOperationsProgramMatches} program roles) •
              {lastUpdated.toLocaleString()}
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
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">By technology focus</p>
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
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">By cadet vs committee pathway</p>
            <div className="grid gap-4 md:grid-cols-2">
              {TECH_ROLE_OPTIONS.map((role) => {
                const bucket = techRoleResults[role];
                return (
                  <article
                    key={role}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">{role}</h3>
                      <p className="text-sm text-slate-400">
                        {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTechRoleDownload(role)}
                      disabled={!bucket}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                    >
                      Download CSV
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Operations Department split</p>
            <h2 className="text-2xl font-semibold text-white">Download operations committee CSVs</h2>
            <p className="text-sm text-slate-300">
              Applicants who chose Operations get bucketed by their preferred committee so you can staff each team quickly.
            </p>
          </header>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">By committee</p>
            <div className="grid gap-4 md:grid-cols-2">
              {OPERATIONS_COMMITTEE_OPTIONS.map((option) => {
                const bucket = operationsResults[option];
                return (
                  <article
                    key={option}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">{option}</h3>
                      <p className="text-sm text-slate-400">
                        {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOperationsDownload(option)}
                      disabled={!bucket}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                    >
                      Download CSV
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Programs committee roles</p>
            <div className="grid gap-4 md:grid-cols-2">
              {OPERATIONS_PROGRAM_ROLES.map((role) => {
                const bucket = operationsProgramResults[role];
                return (
                  <article
                    key={role}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">{role}</h3>
                      <p className="text-sm text-slate-400">
                        {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOperationsProgramDownload(role)}
                      disabled={!bucket}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700"
                    >
                      Download CSV
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type ParsedRow = Record<string, string>;

function getColumnValue(row: ParsedRow, columns: readonly string[]): string | undefined {
  for (const column of columns) {
    if (row[column] !== undefined) {
      return row[column];
    }
  }
  return undefined;
}

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

  const headerCounts: Record<string, number> = {};
  const headers = rows[0].map((header) => {
    const base = header.trim();
    const count = (headerCounts[base] ?? 0) + 1;
    headerCounts[base] = count;
    return count === 1 ? base : `${base} (${count})`;
  });
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
