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
    // El estado inicial debe coincidir con el HTML del servidor: leer localStorage
    // en el inicializador de useState rompe la hidratación en las páginas SSR/SSG
    // (el servidor renderiza "sin selección" y el cliente "con selección").
    // Se carga tras el montaje, y los efectos de guardado esperan a esa carga
    // para no pisar lo guardado con el estado vacío inicial.
    const [hydrated, setHydrated] = useState(false);
    const [n8nHosting, setN8nHosting] = useState<'setup' | 'own'>('setup');
    const [selectedProcessIds, setSelectedProcessIds] = useState<Set<string>>(new Set());
    const [customizations, setCustomizations] = useState<Record<string, CustomizationState>>({});

    useEffect(() => {
        try {
            const savedHosting = localStorage.getItem("immoralia_n8n_hosting_v2");
            if (savedHosting === 'setup' || savedHosting === 'own') {
                setN8nHosting(savedHosting);
            }

            const savedSelection = localStorage.getItem("immoralia_selected_processes");
            if (savedSelection) {
                const parsed = JSON.parse(savedSelection);
                if (Array.isArray(parsed)) {
                    const validIds = parsed.filter((id) => processes.some((p) => p.id === id));
                    setSelectedProcessIds(new Set(validIds));
                }
            }

            const savedCustomizations = localStorage.getItem("immoralia_process_customizations");
            if (savedCustomizations) {
                const parsed = JSON.parse(savedCustomizations);
                // Migrate legacy string options to arrays
                if (typeof parsed === 'object' && parsed !== null) {
                    Object.keys(parsed).forEach(key => {
                        const cust = parsed[key];
                        if (cust?.selectedOptions) {
                            Object.keys(cust.selectedOptions).forEach(optKey => {
                                const val = cust.selectedOptions[optKey];
                                if (typeof val === 'string') {
                                    cust.selectedOptions[optKey] = [val];
                                } else if (!Array.isArray(val)) {
                                    cust.selectedOptions[optKey] = [];
                                }
                            });
                        }
                    });
                    setCustomizations(parsed);
                }
            }
        } catch (error) {
            // datos corruptos en localStorage: se mantienen los valores por defecto
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(
            "immoralia_selected_processes",
            JSON.stringify(Array.from(selectedProcessIds))
        );
    }, [hydrated, selectedProcessIds]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem("immoralia_n8n_hosting_v2", n8nHosting);
    }, [hydrated, n8nHosting]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem("immoralia_process_customizations", JSON.stringify(customizations));
    }, [hydrated, customizations]);

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
