import { createContext, useContext, useState } from "react";
import type { DashboardState } from '../types/dashboard';

const defaultState: DashboardState = {
    range: [320, 344],
    formattedRange: ["", ""],
    selectedDays: 1,
    polygons: [],
    dataSources: [
        {
            source: "temperature_2m",
            colorRules: []
        }
    ],
    avgTemp: 0
}

const GlobalContext = createContext<{
    state: DashboardState;
    setState: React.Dispatch<React.SetStateAction<DashboardState>>;
    updateState: (key: string, value: any, parentKey?: keyof DashboardState | null) => void;
}>({
    state: defaultState,
    setState: () => { },
    updateState: () => { }
});

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<DashboardState>(defaultState);

    const updateState = (key: string, value: any, parentKey: keyof DashboardState | null  = null) => {
        setState((prev) => {
            if (!parentKey) {
                return {
                    ...prev,
                    [key]: value
                }
            } else {
                return {
                    ...prev,
                    [parentKey]: {
                        ...(prev[parentKey] as any),
                        [key]: value,
                    }
                }
            }
        });
    }

    return (
        <GlobalContext.Provider value={{ state, setState, updateState }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);