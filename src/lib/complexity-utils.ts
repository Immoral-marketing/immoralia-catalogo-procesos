import { Process } from "@/data/processes";
import { OnboardingAnswers } from "./onboarding-utils";

export type ComplexityLevel = "Baja" | "Media" | "Alta";

const COMPLEXITY_VALUES: Record<string, number> = {
    "Baja": 1,
    "Media": 2,
    "Alta": 3,
    "N/A": 0
};

const VALUES_TO_COMPLEXITY: Record<number, ComplexityLevel> = {
    1: "Baja",
    2: "Media",
    3: "Alta"
};

const TIME_ESTIMATES: Record<ComplexityLevel, string> = {
    "Baja": "1 semana o menos",
    "Media": "1–2 semanas",
    "Alta": "2–3 semanas"
};

export const PLATFORM_DELTAS: Record<string, number> = {
    // ERP Deltas
    "Holded": -1,
    "QuickBooks": -1,
    "Xero": -1,
    "Sage": 0,
    "Odoo": 0,
    "A3": 0,
    "Microsoft Dynamics 365 Business Central": 0,
    "Cegid (Ekon/XRP)": 0,
    "SAP Business One": 1,
    "Oracle NetSuite": 1,
    "SAP S/4HANA": 2,
    "Oracle ERP Cloud": 2,
    "Workday": 2,

    // CRM Deltas
    "HubSpot": -1,
    "Pipedrive": -1,
    "Zoho": -1,
    "Freshsales (Freshworks CRM)": -1,
    "Monday Sales CRM": -1,
    "Copper CRM": -1,
    "Close (Close.io)": -1,
    "Insightly": -1,
    "Zendesk Sell": -1,
    "ActiveCampaign (Deals CRM)": -1,
    "Microsoft Dynamics 365 Sales": 0,
    "SugarCRM": 0,
    "Salesforce": 1
};

export function computeFinalComplexity(
    process: Process,
    onboardingAnswers: OnboardingAnswers | null
): { complexity: ComplexityLevel; timeEstimate: string } {
    const baselineString = process.indicators?.complexity || "Media";
    const baselineValue = COMPLEXITY_VALUES[baselineString as ComplexityLevel] || 2;

    if (!onboardingAnswers) {
        return {
            complexity: baselineString as ComplexityLevel,
            timeEstimate: TIME_ESTIMATES[baselineString as ComplexityLevel] || TIME_ESTIMATES["Media"]
        };
    }

    const erpPlatform = onboardingAnswers.selected_erp_platform_id;
    const crmPlatform = onboardingAnswers.selected_crm_platform_id;

    let erpDelta = 0;
    let crmDelta = 0;

    if (erpPlatform && PLATFORM_DELTAS[erpPlatform] !== undefined) {
        erpDelta = PLATFORM_DELTAS[erpPlatform];
    }

    if (crmPlatform && PLATFORM_DELTAS[crmPlatform] !== undefined) {
        crmDelta = PLATFORM_DELTAS[crmPlatform];
    }

    const domains = process.integration_domains || [];
    const usesERP = domains.includes("ERP");
    const usesCRM = domains.includes("CRM");

    let appliedDelta = 0;

    if (usesERP && usesCRM) {
        // Escoger el que resulte en un tier final más alto
        appliedDelta = Math.max(erpDelta, crmDelta);
    } else if (usesERP) {
        appliedDelta = erpDelta;
    } else if (usesCRM) {
        appliedDelta = crmDelta;
    }

    if (process.id === "F25" || baselineString === "N/A") {
        return {
            complexity: "N/A" as any,
            timeEstimate: "2-3 semanas"
        };
    }

    let finalValue = Math.min(Math.max(baselineValue + appliedDelta, 1), 3);

    // Suelo para Presupuestos Automáticos (ID: A3): Nunca baja de Media (2)
    if (process.id === "A3") {
        finalValue = Math.max(finalValue, 2);
    }

    const finalComplexity = VALUES_TO_COMPLEXITY[finalValue];

    return {
        complexity: finalComplexity,
        timeEstimate: TIME_ESTIMATES[finalComplexity]
    };
}
