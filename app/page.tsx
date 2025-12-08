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
const OPERATIONS_POSITION_COLUMN = "What position would you like to apply for? (Operations)";
const OPERATIONS_POSITION_OPTIONS = [
  "Operations Managers",
  "Logistics and Resource Coordinator",
  "Ushering and Guest Coordinator",
  "Registration and Access Coordinators",
  "Media Documentation Coordinators",
] as const;
const OPERATIONS_MEDIA_COLUMN = "What role would you like to apply for? (Operations Media)";
const OPERATIONS_MEDIA_OPTIONS = [
  "Photo Documentation Coordinator",
  "Video Documentation Coordinator",
] as const;
const OPERATIONS_POSITION_EXPORT_HEADER = OPERATIONS_POSITION_COLUMN;
const OPERATIONS_MEDIA_EXPORT_HEADER = OPERATIONS_MEDIA_COLUMN;
const CREATIVES_ROLE_COLUMN = "Which role would you like to apply for? (Creatives)";
const CREATIVES_ROLE_OPTIONS = [
  "Graphic Designers",
  "Illustrators",
  "Photo Editors",
  "Video Editors",
  "Animators",
] as const;
const CREATIVES_TEAM_OPTIONS = ["Graphic Design Team", "Multimedia Team"] as const;
const CREATIVES_ROLE_EXPORT_HEADER = CREATIVES_ROLE_COLUMN;
const CREATIVES_TEAM_EXPORT_HEADER = "Creatives Team";
const MARKETING_ROLE_COLUMN = "Which role would you like to apply for? (Marketing)";
const MARKETING_ROLE_OPTIONS = [
  "Caption Writer",
  "Engagement & Statistics Analyst",
  "Content Strategist",
  "Video Director",
  "Photographer",
  "Videographer",
] as const;
const MARKETING_TEAM_OPTIONS = ["Content Management Team", "Content Creation Team"] as const;
const MARKETING_ROLE_EXPORT_HEADER = MARKETING_ROLE_COLUMN;
const MARKETING_TEAM_EXPORT_HEADER = "Marketing Team";
const RELATIONS_COMMUNITY_TEAM_COLUMN = "Which team would you like to apply for? (Relations Community)";
const RELATIONS_COMMUNITY_TEAM_OPTIONS = [
  "Member Engagement Team",
  "Member Relations and Support Team",
] as const;
const RELATIONS_COMMUNITY_TEAM_EXPORT_HEADER = RELATIONS_COMMUNITY_TEAM_COLUMN;
const RELATIONS_PUBLIC_TEAM_COLUMN = "Which team would you like to apply for? (Relations Public)";
const RELATIONS_PUBLIC_TEAM_OPTIONS = [
  "Organization Partnership Team",
  "Community Partnership Team",
  "Partnership Compliance Team",
] as const;
const RELATIONS_PUBLIC_TEAM_EXPORT_HEADER = RELATIONS_PUBLIC_TEAM_COLUMN;

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
  {
    label: OPERATIONS_POSITION_COLUMN,
    columns: [OPERATIONS_POSITION_COLUMN] as const,
  },
  {
    label: OPERATIONS_MEDIA_COLUMN,
    columns: [OPERATIONS_MEDIA_COLUMN] as const,
  },
  {
    label: CREATIVES_ROLE_COLUMN,
    columns: [CREATIVES_ROLE_COLUMN] as const,
  },
  {
    label: MARKETING_ROLE_COLUMN,
    columns: [MARKETING_ROLE_COLUMN] as const,
  },
  {
    label: RELATIONS_COMMUNITY_TEAM_COLUMN,
    columns: [RELATIONS_COMMUNITY_TEAM_COLUMN] as const,
  },
  {
    label: RELATIONS_PUBLIC_TEAM_COLUMN,
    columns: [RELATIONS_PUBLIC_TEAM_COLUMN] as const,
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
const OPERATIONS_COMMITTEE_OPTIONS = ["Operations Committee", "Programs Committee"] as const;
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
type OperationsPosition = (typeof OPERATIONS_POSITION_OPTIONS)[number];
type OperationsMediaRole = (typeof OPERATIONS_MEDIA_OPTIONS)[number];
type CreativesRole = (typeof CREATIVES_ROLE_OPTIONS)[number];
type CreativesTeam = (typeof CREATIVES_TEAM_OPTIONS)[number];
type MarketingRole = (typeof MARKETING_ROLE_OPTIONS)[number];
type MarketingTeam = (typeof MARKETING_TEAM_OPTIONS)[number];
type RelationsCommunityTeam = (typeof RELATIONS_COMMUNITY_TEAM_OPTIONS)[number];
type RelationsPublicTeam = (typeof RELATIONS_PUBLIC_TEAM_OPTIONS)[number];
type ResultBucket = { csv: string; rows: number };
type DepartmentRow = {
  name: string;
  email: string;
  department: Department;
  techDepartment?: TechDepartment;
  techRole?: TechRole;
  operationsCommittee?: OperationsCommittee;
  operationsProgramRole?: OperationsProgramRole;
  operationsPosition?: OperationsPosition;
  operationsMediaRole?: OperationsMediaRole;
  creativesRoles?: CreativesRole[];
  creativesTeams?: CreativesTeam[];
  marketingRoles?: MarketingRole[];
  marketingTeams?: MarketingTeam[];
  relationsCommunityTeam?: RelationsCommunityTeam;
  relationsPublicTeam?: RelationsPublicTeam;
};

const OPERATIONS_PROGRAM_ROLE_ALIASES: Record<OperationsProgramRole, readonly string[]> = {
  "Host Coordinators": ["Host Coordinator"],
  Hosts: ["Host"],
  "Program Managers": ["Program Manager"],
  "Technical Coordinators": ["Technical Coordinator"],
};

const OPERATIONS_POSITION_ALIASES: Partial<Record<OperationsPosition, readonly string[]>> = {
  "Operations Managers": ["Operations Manager"],
  "Logistics and Resource Coordinator": ["Logistics and Resource Coordinators"],
  "Ushering and Guest Coordinator": ["Ushering and Guest Coordinators"],
  "Registration and Access Coordinators": ["Registration and Access Coordinator"],
  "Media Documentation Coordinators": [
    "Media Documentation Coordinators",
    "Media Documentation Officer",
    "Media Documentation Coordinator",
  ],
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

const toOperationsPosition = (value: string | undefined | null): OperationsPosition | undefined =>
  {
    const directMatch = normalizeChoice(value, OPERATIONS_POSITION_OPTIONS);
    if (directMatch || !value) {
      return directMatch;
    }

    const normalized = normalizeText(value);
    for (const [position, aliases] of Object.entries(OPERATIONS_POSITION_ALIASES) as [
      OperationsPosition,
      readonly string[],
    ][]) {
      if (aliases.some((alias) => normalizeText(alias) === normalized)) {
        return position;
      }
    }

    return undefined;
  };

const toOperationsMediaRole = (value: string | undefined | null): OperationsMediaRole | undefined =>
  normalizeChoice(value, OPERATIONS_MEDIA_OPTIONS);

const parseCreativesRoles = (value: string | undefined | null): CreativesRole[] => {
  if (!value) {
    return [];
  }

  const tokens = value
    .split(/[,;\n]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const roles = tokens
    .map((token) => normalizeChoice(token, CREATIVES_ROLE_OPTIONS))
    .filter((token): token is CreativesRole => Boolean(token));

  return Array.from(new Set(roles));
};

const CREATIVES_ROLE_TO_TEAM: Record<CreativesRole, CreativesTeam> = {
  "Graphic Designers": "Graphic Design Team",
  Illustrators: "Graphic Design Team",
  "Photo Editors": "Multimedia Team",
  "Video Editors": "Multimedia Team",
  Animators: "Multimedia Team",
};

const getCreativesTeams = (roles: CreativesRole[]): CreativesTeam[] => {
  const teams = roles.map((role) => CREATIVES_ROLE_TO_TEAM[role]);
  return Array.from(new Set(teams));
};

const parseMarketingRoles = (value: string | undefined | null): MarketingRole[] => {
  if (!value) {
    return [];
  }

  const tokens = value
    .split(/[,;\n]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const roles = tokens
    .map((token) => normalizeChoice(token, MARKETING_ROLE_OPTIONS))
    .filter((token): token is MarketingRole => Boolean(token));

  return Array.from(new Set(roles));
};

const MARKETING_ROLE_TO_TEAM: Record<MarketingRole, MarketingTeam> = {
  "Caption Writer": "Content Management Team",
  "Engagement & Statistics Analyst": "Content Management Team",
  "Content Strategist": "Content Management Team",
  "Video Director": "Content Creation Team",
  Photographer: "Content Creation Team",
  Videographer: "Content Creation Team",
};

const getMarketingTeams = (roles: MarketingRole[]): MarketingTeam[] => {
  const teams = roles.map((role) => MARKETING_ROLE_TO_TEAM[role]);
  return Array.from(new Set(teams));
};

const toRelationsCommunityTeam = (
  value: string | undefined | null
): RelationsCommunityTeam | undefined => normalizeChoice(value, RELATIONS_COMMUNITY_TEAM_OPTIONS);

const toRelationsPublicTeam = (
  value: string | undefined | null
): RelationsPublicTeam | undefined => normalizeChoice(value, RELATIONS_PUBLIC_TEAM_OPTIONS);

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

const createEmptyOperationsPositionResults = (): Record<OperationsPosition, ResultBucket | null> =>
  OPERATIONS_POSITION_OPTIONS.reduce((acc, position) => {
    acc[position] = null;
    return acc;
  }, {} as Record<OperationsPosition, ResultBucket | null>);

const createEmptyOperationsMediaResults = (): Record<OperationsMediaRole, ResultBucket | null> =>
  OPERATIONS_MEDIA_OPTIONS.reduce((acc, role) => {
    acc[role] = null;
    return acc;
  }, {} as Record<OperationsMediaRole, ResultBucket | null>);

const createEmptyCreativesTeamResults = (): Record<CreativesTeam, ResultBucket | null> =>
  CREATIVES_TEAM_OPTIONS.reduce((acc, team) => {
    acc[team] = null;
    return acc;
  }, {} as Record<CreativesTeam, ResultBucket | null>);

const createEmptyMarketingTeamResults = (): Record<MarketingTeam, ResultBucket | null> =>
  MARKETING_TEAM_OPTIONS.reduce((acc, team) => {
    acc[team] = null;
    return acc;
  }, {} as Record<MarketingTeam, ResultBucket | null>);

const createEmptyRelationsCommunityResults = (): Record<RelationsCommunityTeam, ResultBucket | null> =>
  RELATIONS_COMMUNITY_TEAM_OPTIONS.reduce((acc, team) => {
    acc[team] = null;
    return acc;
  }, {} as Record<RelationsCommunityTeam, ResultBucket | null>);

const createEmptyRelationsPublicResults = (): Record<RelationsPublicTeam, ResultBucket | null> =>
  RELATIONS_PUBLIC_TEAM_OPTIONS.reduce((acc, team) => {
    acc[team] = null;
    return acc;
  }, {} as Record<RelationsPublicTeam, ResultBucket | null>);

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
  const [operationsPositionResults, setOperationsPositionResults] = useState(
    createEmptyOperationsPositionResults
  );
  const [operationsMediaResults, setOperationsMediaResults] = useState(
    createEmptyOperationsMediaResults
  );
  const [creativesTeamResults, setCreativesTeamResults] = useState(createEmptyCreativesTeamResults);
  const [marketingTeamResults, setMarketingTeamResults] = useState(createEmptyMarketingTeamResults);
  const [relationsCommunityResults, setRelationsCommunityResults] = useState(
    createEmptyRelationsCommunityResults
  );
  const [relationsPublicResults, setRelationsPublicResults] = useState(
    createEmptyRelationsPublicResults
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

  const totalOperationsPositionMatches = useMemo(() => {
    return OPERATIONS_POSITION_OPTIONS.reduce(
      (sum, position) => sum + (operationsPositionResults[position]?.rows ?? 0),
      0
    );
  }, [operationsPositionResults]);

  const totalOperationsMediaMatches = useMemo(() => {
    return OPERATIONS_MEDIA_OPTIONS.reduce(
      (sum, role) => sum + (operationsMediaResults[role]?.rows ?? 0),
      0
    );
  }, [operationsMediaResults]);

  const totalCreativesTeamMatches = useMemo(() => {
    return CREATIVES_TEAM_OPTIONS.reduce(
      (sum, team) => sum + (creativesTeamResults[team]?.rows ?? 0),
      0
    );
  }, [creativesTeamResults]);

  const totalMarketingTeamMatches = useMemo(() => {
    return MARKETING_TEAM_OPTIONS.reduce(
      (sum, team) => sum + (marketingTeamResults[team]?.rows ?? 0),
      0
    );
  }, [marketingTeamResults]);

  const totalRelationsCommunityMatches = useMemo(() => {
    return RELATIONS_COMMUNITY_TEAM_OPTIONS.reduce(
      (sum, team) => sum + (relationsCommunityResults[team]?.rows ?? 0),
      0
    );
  }, [relationsCommunityResults]);

  const totalRelationsPublicMatches = useMemo(() => {
    return RELATIONS_PUBLIC_TEAM_OPTIONS.reduce(
      (sum, team) => sum + (relationsPublicResults[team]?.rows ?? 0),
      0
    );
  }, [relationsPublicResults]);

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
          setOperationsPositionResults(createEmptyOperationsPositionResults());
          setOperationsMediaResults(createEmptyOperationsMediaResults());
          setCreativesTeamResults(createEmptyCreativesTeamResults());
          setMarketingTeamResults(createEmptyMarketingTeamResults());
          setRelationsCommunityResults(createEmptyRelationsCommunityResults());
          setRelationsPublicResults(createEmptyRelationsPublicResults());
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
          setOperationsPositionResults(createEmptyOperationsPositionResults());
          setOperationsMediaResults(createEmptyOperationsMediaResults());
          setCreativesTeamResults(createEmptyCreativesTeamResults());
          setMarketingTeamResults(createEmptyMarketingTeamResults());
          setRelationsCommunityResults(createEmptyRelationsCommunityResults());
          setRelationsPublicResults(createEmptyRelationsPublicResults());
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

        const operationsPositionGrouped = OPERATIONS_POSITION_OPTIONS.reduce((acc, position) => {
          acc[position] = [] as string[][];
          return acc;
        }, {} as Record<OperationsPosition, string[][]>);

        const operationsMediaGrouped = OPERATIONS_MEDIA_OPTIONS.reduce((acc, role) => {
          acc[role] = [] as string[][];
          return acc;
        }, {} as Record<OperationsMediaRole, string[][]>);

        const creativesTeamGrouped = CREATIVES_TEAM_OPTIONS.reduce((acc, team) => {
          acc[team] = [] as string[][];
          return acc;
        }, {} as Record<CreativesTeam, string[][]>);

        const marketingTeamGrouped = MARKETING_TEAM_OPTIONS.reduce((acc, team) => {
          acc[team] = [] as string[][];
          return acc;
        }, {} as Record<MarketingTeam, string[][]>);

        const relationsCommunityGrouped = RELATIONS_COMMUNITY_TEAM_OPTIONS.reduce((acc, team) => {
          acc[team] = [] as string[][];
          return acc;
        }, {} as Record<RelationsCommunityTeam, string[][]>);

        const relationsPublicGrouped = RELATIONS_PUBLIC_TEAM_OPTIONS.reduce((acc, team) => {
          acc[team] = [] as string[][];
          return acc;
        }, {} as Record<RelationsPublicTeam, string[][]>);

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
          const operationsPositionValue =
            selectedDepartment === "Operations Department" && operationsValue === "Operations Committee"
              ? toOperationsPosition(getColumnValue(row, [OPERATIONS_POSITION_COLUMN] as const))
              : undefined;
          const operationsMediaValue =
            operationsPositionValue === "Media Documentation Coordinators"
              ? toOperationsMediaRole(getColumnValue(row, [OPERATIONS_MEDIA_COLUMN] as const))
              : undefined;
          const creativesRoles =
            selectedDepartment === "Creatives Department"
              ? parseCreativesRoles(getColumnValue(row, [CREATIVES_ROLE_COLUMN] as const))
              : [];
          const creativesTeams = creativesRoles.length ? getCreativesTeams(creativesRoles) : [];
          const marketingRoles =
            selectedDepartment === "Marketing Department"
              ? parseMarketingRoles(getColumnValue(row, [MARKETING_ROLE_COLUMN] as const))
              : [];
          const marketingTeams = marketingRoles.length ? getMarketingTeams(marketingRoles) : [];
          const relationsCommunityTeam =
            selectedDepartment === "Relations Department: Community"
              ? toRelationsCommunityTeam(getColumnValue(row, [RELATIONS_COMMUNITY_TEAM_COLUMN] as const))
              : undefined;
          const relationsPublicTeam =
            selectedDepartment === "Relations Department: Public"
              ? toRelationsPublicTeam(getColumnValue(row, [RELATIONS_PUBLIC_TEAM_COLUMN] as const))
              : undefined;

          grouped[selectedDepartment].push({
            name: nameValue,
            email: emailValue,
            department: selectedDepartment,
            techDepartment: techValue,
            techRole: roleValue,
            operationsCommittee: operationsValue,
            operationsProgramRole: operationsProgramValue,
            operationsPosition: operationsPositionValue,
            operationsMediaRole: operationsMediaValue,
            creativesRoles: creativesRoles.length ? creativesRoles : undefined,
            creativesTeams: creativesTeams.length ? creativesTeams : undefined,
            marketingRoles: marketingRoles.length ? marketingRoles : undefined,
            marketingTeams: marketingTeams.length ? marketingTeams : undefined,
            relationsCommunityTeam,
            relationsPublicTeam,
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

          if (
            selectedDepartment === "Operations Department" &&
            operationsValue === "Operations Committee" &&
            operationsPositionValue
          ) {
            operationsPositionGrouped[operationsPositionValue].push([
              nameValue,
              emailValue,
              operationsPositionValue,
            ]);
          }

          if (operationsPositionValue === "Media Documentation Coordinators" && operationsMediaValue) {
            operationsMediaGrouped[operationsMediaValue].push([
              nameValue,
              emailValue,
              operationsPositionValue,
              operationsMediaValue,
            ]);
          }

          if (selectedDepartment === "Creatives Department" && creativesTeams.length) {
            creativesTeams.forEach((team) => {
              creativesTeamGrouped[team].push([nameValue, emailValue, team]);
            });
          }

          if (selectedDepartment === "Marketing Department" && marketingTeams.length) {
            marketingTeams.forEach((team) => {
              marketingTeamGrouped[team].push([nameValue, emailValue, team]);
            });
          }

          if (selectedDepartment === "Relations Department: Community" && relationsCommunityTeam) {
            relationsCommunityGrouped[relationsCommunityTeam].push([
              nameValue,
              emailValue,
              relationsCommunityTeam,
            ]);
          }

          if (selectedDepartment === "Relations Department: Public" && relationsPublicTeam) {
            relationsPublicGrouped[relationsPublicTeam].push([
              nameValue,
              emailValue,
              relationsPublicTeam,
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
                  OPERATIONS_POSITION_EXPORT_HEADER,
                  OPERATIONS_MEDIA_EXPORT_HEADER,
                ];
              }
              if (dept === "Creatives Department") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  CREATIVES_ROLE_EXPORT_HEADER,
                  CREATIVES_TEAM_EXPORT_HEADER,
                ];
              }
              if (dept === "Marketing Department") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  MARKETING_ROLE_EXPORT_HEADER,
                  MARKETING_TEAM_EXPORT_HEADER,
                ];
              }
              if (dept === "Relations Department: Public") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  RELATIONS_PUBLIC_TEAM_EXPORT_HEADER,
                ];
              }
              if (dept === "Relations Department: Community") {
                return [
                  NAME_COLUMN,
                  EMAIL_COLUMN,
                  DEPARTMENT_COLUMN,
                  RELATIONS_COMMUNITY_TEAM_EXPORT_HEADER,
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
                      entry.operationsPosition ?? "",
                      entry.operationsMediaRole ?? "",
                    ];
                  }
                  if (dept === "Creatives Department") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.creativesRoles?.join("; ") ?? "",
                      entry.creativesTeams?.join("; ") ?? "",
                    ];
                  }
                  if (dept === "Marketing Department") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.marketingRoles?.join("; ") ?? "",
                      entry.marketingTeams?.join("; ") ?? "",
                    ];
                  }
                  if (dept === "Relations Department: Public") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.relationsPublicTeam ?? "",
                    ];
                  }
                  if (dept === "Relations Department: Community") {
                    return [
                      entry.name,
                      entry.email,
                      entry.department,
                      entry.relationsCommunityTeam ?? "",
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

        const operationsPositionFinalized = OPERATIONS_POSITION_OPTIONS.reduce((acc, position) => {
          const entries = operationsPositionGrouped[position];
          if (!entries.length) {
            acc[position] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, OPERATIONS_POSITION_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[position] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<OperationsPosition, ResultBucket | null>);

        const operationsMediaFinalized = OPERATIONS_MEDIA_OPTIONS.reduce((acc, role) => {
          const entries = operationsMediaGrouped[role];
          if (!entries.length) {
            acc[role] = null;
          } else {
            const header = [
              NAME_COLUMN,
              EMAIL_COLUMN,
              OPERATIONS_POSITION_EXPORT_HEADER,
              OPERATIONS_MEDIA_EXPORT_HEADER,
            ];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[role] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<OperationsMediaRole, ResultBucket | null>);

        const creativesTeamFinalized = CREATIVES_TEAM_OPTIONS.reduce((acc, team) => {
          const entries = creativesTeamGrouped[team];
          if (!entries.length) {
            acc[team] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, CREATIVES_TEAM_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[team] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<CreativesTeam, ResultBucket | null>);

        const marketingTeamFinalized = MARKETING_TEAM_OPTIONS.reduce((acc, team) => {
          const entries = marketingTeamGrouped[team];
          if (!entries.length) {
            acc[team] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, MARKETING_TEAM_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[team] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<MarketingTeam, ResultBucket | null>);

        const relationsCommunityFinalized = RELATIONS_COMMUNITY_TEAM_OPTIONS.reduce((acc, team) => {
          const entries = relationsCommunityGrouped[team];
          if (!entries.length) {
            acc[team] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, RELATIONS_COMMUNITY_TEAM_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[team] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<RelationsCommunityTeam, ResultBucket | null>);

        const relationsPublicFinalized = RELATIONS_PUBLIC_TEAM_OPTIONS.reduce((acc, team) => {
          const entries = relationsPublicGrouped[team];
          if (!entries.length) {
            acc[team] = null;
          } else {
            const header = [NAME_COLUMN, EMAIL_COLUMN, RELATIONS_PUBLIC_TEAM_EXPORT_HEADER];
            const csvLines = [
              header.join(","),
              ...entries.map((entry) => entry.map(escapeForCsv).join(",")),
            ];
            acc[team] = { csv: csvLines.join("\r\n"), rows: entries.length };
          }
          return acc;
        }, {} as Record<RelationsPublicTeam, ResultBucket | null>);

        setResults(finalized);
        setTechResults(techFinalized);
        setTechRoleResults(techRoleFinalized);
        setOperationsResults(operationsFinalized);
        setOperationsProgramResults(operationsProgramFinalized);
        setOperationsPositionResults(operationsPositionFinalized);
        setOperationsMediaResults(operationsMediaFinalized);
        setCreativesTeamResults(creativesTeamFinalized);
        setMarketingTeamResults(marketingTeamFinalized);
        setRelationsCommunityResults(relationsCommunityFinalized);
        setRelationsPublicResults(relationsPublicFinalized);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
        setResults(createEmptyResults());
        setTechResults(createEmptyTechResults());
        setTechRoleResults(createEmptyTechRoleResults());
        setOperationsResults(createEmptyOperationsResults());
        setOperationsProgramResults(createEmptyOperationsProgramResults());
        setOperationsPositionResults(createEmptyOperationsPositionResults());
        setOperationsMediaResults(createEmptyOperationsMediaResults());
        setCreativesTeamResults(createEmptyCreativesTeamResults());
        setMarketingTeamResults(createEmptyMarketingTeamResults());
        setRelationsCommunityResults(createEmptyRelationsCommunityResults());
        setRelationsPublicResults(createEmptyRelationsPublicResults());
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
      setOperationsPositionResults(createEmptyOperationsPositionResults());
      setOperationsMediaResults(createEmptyOperationsMediaResults());
      setCreativesTeamResults(createEmptyCreativesTeamResults());
      setMarketingTeamResults(createEmptyMarketingTeamResults());
      setRelationsCommunityResults(createEmptyRelationsCommunityResults());
      setRelationsPublicResults(createEmptyRelationsPublicResults());
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

  const handleOperationsPositionDownload = (position: OperationsPosition) => {
    triggerDownload(`Operations-Committee-${position}`, operationsPositionResults[position]);
  };

  const handleOperationsMediaDownload = (role: OperationsMediaRole) => {
    triggerDownload(`Operations-Media-${role}`, operationsMediaResults[role]);
  };

  const handleCreativesTeamDownload = (team: CreativesTeam) => {
    triggerDownload(`Creatives-${team}`, creativesTeamResults[team]);
  };

  const handleMarketingTeamDownload = (team: MarketingTeam) => {
    triggerDownload(`Marketing-${team}`, marketingTeamResults[team]);
  };

  const handleRelationsPublicDownload = (team: RelationsPublicTeam) => {
    triggerDownload(`Relations-Public-${team}`, relationsPublicResults[team]);
  };

  const handleRelationsCommunityDownload = (team: RelationsCommunityTeam) => {
    triggerDownload(`Relations-Community-${team}`, relationsCommunityResults[team]);
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
              {totalCreativesTeamMatches} creatives teams • {totalMarketingTeamMatches} marketing teams •
              {totalRelationsPublicMatches} relations-public teams •
              {totalRelationsCommunityMatches} relations-community teams •
              {totalOperationsCommitteeMatches} ops committee •
              {totalOperationsPositionMatches} ops positions • {totalOperationsMediaMatches} media roles •
              {totalOperationsProgramMatches} program roles) •
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

        <section className="space-y-4 rounded-2xl border border-rose-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Creatives Department split</p>
            <h2 className="text-2xl font-semibold text-white">Download creatives team CSVs</h2>
            <p className="text-sm text-slate-300">
              Applicants selecting Creatives get routed into the Graphic Design or Multimedia teams based on their
              role combinations.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {CREATIVES_TEAM_OPTIONS.map((team) => {
              const bucket = creativesTeamResults[team];
              return (
                <article
                  key={team}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">{team}</h3>
                    <p className="text-sm text-slate-400">
                      {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCreativesTeamDownload(team)}
                    disabled={!bucket}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Marketing Department split</p>
            <h2 className="text-2xl font-semibold text-white">Download marketing team CSVs</h2>
            <p className="text-sm text-slate-300">
              Marketing applicants get mapped into Content Management or Content Creation teams depending on their
              role checkboxes.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {MARKETING_TEAM_OPTIONS.map((team) => {
              const bucket = marketingTeamResults[team];
              return (
                <article
                  key={team}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">{team}</h3>
                    <p className="text-sm text-slate-400">
                      {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarketingTeamDownload(team)}
                    disabled={!bucket}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-lime-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-lime-300">Relations Public split</p>
            <h2 className="text-2xl font-semibold text-white">Download relations public CSVs</h2>
            <p className="text-sm text-slate-300">
              Public relations applicants branch into the Organization, Community, or Compliance partnership teams.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {RELATIONS_PUBLIC_TEAM_OPTIONS.map((team) => {
              const bucket = relationsPublicResults[team];
              return (
                <article
                  key={team}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">{team}</h3>
                    <p className="text-sm text-slate-400">
                      {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRelationsPublicDownload(team)}
                    disabled={!bucket}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-lime-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-lime-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Relations Community split</p>
            <h2 className="text-2xl font-semibold text-white">Download relations community CSVs</h2>
            <p className="text-sm text-slate-300">
              Community relations applicants choose between the Member Engagement and Member Relations teams.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {RELATIONS_COMMUNITY_TEAM_OPTIONS.map((team) => {
              const bucket = relationsCommunityResults[team];
              return (
                <article
                  key={team}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-white">{team}</h3>
                    <p className="text-sm text-slate-400">
                      {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRelationsCommunityDownload(team)}
                    disabled={!bucket}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
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
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operations committee positions</p>
            <div className="grid gap-4 md:grid-cols-2">
              {OPERATIONS_POSITION_OPTIONS.map((position) => {
                const bucket = operationsPositionResults[position];
                return (
                  <article
                    key={position}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">{position}</h3>
                      <p className="text-sm text-slate-400">
                        {bucket ? `${bucket.rows} match${bucket.rows === 1 ? "" : "es"}` : "Awaiting data"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOperationsPositionDownload(position)}
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
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Media documentation roles</p>
            <div className="grid gap-4 md:grid-cols-2">
              {OPERATIONS_MEDIA_OPTIONS.map((role) => {
                const bucket = operationsMediaResults[role];
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
                      onClick={() => handleOperationsMediaDownload(role)}
                      disabled={!bucket}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-300 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-700"
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
