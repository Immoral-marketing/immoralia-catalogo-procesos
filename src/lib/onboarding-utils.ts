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
    [key: string]: any;
}

const ONBOARDING_COMPLETED_KEY = "immoralia_onboarding_completed";
const ONBOARDING_ANSWERS_KEY = "immoralia_onboarding_answers";

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
};
