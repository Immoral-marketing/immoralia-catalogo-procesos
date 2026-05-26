export interface OnboardingAnswers {
    sector: string;
    otherSector?: string;
    tools: string[];
    otherTool?: string;
    channels: {
        clients: string[];
        internal: string[];
    };
    maturity: "Básico" | "Intermedio" | "Avanzado";
    usesAI: boolean;
    aiTools?: string;
    aiUsagePurpose?: string;
    volume?: string;
    pains: string[];
    otherPain?: string;
    biggestPain?: string;
    // Campos de contacto (Lead Magnet)
    nombre?: string;
    email?: string;
    telefono?: string;
    // Campos de plataforma para complejidad dinámica
    selected_crm_platform_id?: string;
    selected_erp_platform_id?: string;
    [key: string]: any;
}

const ONBOARDING_COMPLETED_KEY = "immoralia_onboarding_completed";
const ONBOARDING_ANSWERS_KEY = "immoralia_onboarding_answers";

// Lead capture keys
const LEAD_CAPTURED_KEY = "immoralia_lead_captured";
const LEAD_SKIPPED_SESSION_KEY = "immoralia_lead_skipped_session";

// Lead capture: si el usuario rellena el mini form → localStorage (nunca más)
export const isLeadCaptured = (): boolean => {
    return localStorage.getItem(LEAD_CAPTURED_KEY) === "true";
};

export const markLeadCaptured = () => {
    localStorage.setItem(LEAD_CAPTURED_KEY, "true");
};

// Lead capture: si el usuario omite → sessionStorage (solo esta sesión)
export const isLeadSkippedThisSession = (): boolean => {
    return sessionStorage.getItem(LEAD_SKIPPED_SESSION_KEY) === "true";
};

export const markLeadSkippedThisSession = () => {
    sessionStorage.setItem(LEAD_SKIPPED_SESSION_KEY, "true");
};

// Combina ambas: devuelve true si debemos mostrar el lead capture modal
export const shouldShowLeadCapture = (): boolean => {
    return !isLeadCaptured() && !isLeadSkippedThisSession();
};

export const saveOnboardingData = (answers: OnboardingAnswers) => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    localStorage.setItem(ONBOARDING_ANSWERS_KEY, JSON.stringify(answers));
};

export const getOnboardingAnswers = (): OnboardingAnswers | null => {
    const saved = localStorage.getItem(ONBOARDING_ANSWERS_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing onboarding answers", e);
        }
    }
    return null;
};

export const isOnboardingCompleted = (): boolean => {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
};

export const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
};

export const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    localStorage.removeItem(ONBOARDING_ANSWERS_KEY);
    // Clear guidance messages state
    localStorage.removeItem("immoralia_guidance_dismissed_inicio_quiz");
    localStorage.removeItem("immoralia_guidance_dismissed_post_quiz");
    localStorage.removeItem("immoralia_guidance_dismissed_catalogo_principal");
    
    // Notify components to update their visibility
    window.dispatchEvent(new Event('immoralia_guidance_reset'));
};
