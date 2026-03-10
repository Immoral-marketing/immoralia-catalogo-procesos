import React, { createContext, useContext, useState, useEffect } from 'react';
import { processes } from '@/data/processes';

interface CustomizationState {
    selectedOptions: Record<string, string[]>;
    customInputs: Record<string, string>;
}

interface SelectionContextType {
    selectedProcessIds: Set<string>;
    toggleProcess: (id: string) => void;
    clearSelection: () => void;
    n8nHosting: 'setup' | 'own';
    setN8nHosting: (value: 'setup' | 'own') => void;
    customizations: Record<string, CustomizationState>;
    updateCustomization: (processId: string, options: Record<string, string[]>, inputs: Record<string, string>) => void;
    clearCustomizations: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [n8nHosting, setN8nHosting] = useState<'setup' | 'own'>(() => {
        try {
            const saved = localStorage.getItem("immoralia_n8n_hosting_v2");
            return (saved === 'setup' || saved === 'own') ? saved : 'setup';
        } catch (error) {
            console.error("Error recuperando hosting:", error);
            return 'setup';
        }
    });

    const [selectedProcessIds, setSelectedProcessIds] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem("immoralia_selected_processes");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const validIds = parsed.filter((id) => processes.some((p) => p.id === id));
                    return new Set(validIds);
                }
            }
        } catch (error) {
            console.error("Error recuperando selección:", error);
        }
        return new Set();
    });

    const [customizations, setCustomizations] = useState<Record<string, CustomizationState>>(() => {
        try {
            const saved = localStorage.getItem("immoralia_process_customizations");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Migrate legacy string options to arrays
                if (typeof parsed === 'object') {
                    Object.keys(parsed).forEach(key => {
                        const cust = parsed[key];
                        if (cust?.selectedOptions) {
                            Object.keys(cust.selectedOptions).forEach(optKey => {
                                const val = cust.selectedOptions[optKey];
                                if (typeof val === 'string') {
                                    cust.selectedOptions[optKey] = [val];
                                } else if (!Array.isArray(val)) {
                                    // Fallback for weird data
                                    cust.selectedOptions[optKey] = [];
                                }
                            });
                        }
                    });
                }
                return parsed;
            }
        } catch (error) {
            console.error("Error recuperando customizaciones:", error);
        }
        return {};
    });

    useEffect(() => {
        localStorage.setItem(
            "immoralia_selected_processes",
            JSON.stringify(Array.from(selectedProcessIds))
        );
    }, [selectedProcessIds]);

    useEffect(() => {
        localStorage.setItem("immoralia_n8n_hosting_v2", n8nHosting);
    }, [n8nHosting]);

    useEffect(() => {
        localStorage.setItem("immoralia_process_customizations", JSON.stringify(customizations));
    }, [customizations]);

    const toggleProcess = (id: string) => {
        setSelectedProcessIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const clearSelection = () => {
        setSelectedProcessIds(newSet => new Set());
    };

    const updateCustomization = (processId: string, options: Record<string, string[]>, inputs: Record<string, string>) => {
        setCustomizations(prev => ({
            ...prev,
            [processId]: {
                selectedOptions: options,
                customInputs: inputs
            }
        }));
    };

    const clearCustomizations = () => {
        setCustomizations({});
    };

    return (
        <SelectionContext.Provider value={{
            selectedProcessIds,
            toggleProcess,
            clearSelection,
            n8nHosting,
            setN8nHosting,
            customizations,
            updateCustomization,
            clearCustomizations
        }}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (context === undefined) {
        throw new Error('useSelection must be used within a SelectionProvider');
    }
    return context;
};
