import toast from "react-hot-toast";
import type { PolygonData } from "../types/polygon";
import { getAverageTemperature, getColorForTemperature, getPolygonCentroid } from "./math";
import { getTemperatureForPolygon } from "../api/api";
import type { DataSource } from "../types/datasource";
import type { DashboardState } from "../types/dashboard";

const tempCache = new Map<string, number>();

export const calculatePolygonColoring = async (
    polygons: PolygonData[],
    setState: React.Dispatch<React.SetStateAction<DashboardState>>,
    range: [string, string],
    dataSources: DataSource[]
) => {
    try {
        for (let i = 0; i < polygons.length; i++) {
            const polygon = polygons[i];
            const { lat, lng } = getPolygonCentroid(polygon.coordinates);
            const key = `${lat}-${lng}-${range[0]}-${range[1]}`;
            
            // set cache value
            if (!tempCache.has(key)) {
                const temps = await getTemperatureForPolygon({ lat, lng }, range);
                if (!temps || !Array.isArray(temps)) {
                    console.warn(`Temperature data not available for ${key}`);
                    continue;
                }
                tempCache.set(key, getAverageTemperature(temps) ?? 0);
            }

            const avgTemp = tempCache.get(key) ?? 0;
            const color = getColorForTemperature(dataSources, avgTemp);

            setState((prev) => ({
                ...prev,
                avgTemp: avgTemp,
                polygons: prev.polygons.map((p) =>
                    p.id === polygon.id ? { ...p, fillColor: color } : p
                ),
            }));
        }
    } catch (error) {
        console.log(`Error while calculating polygon coloring : ${error}`);
        toast.error("Failed to update polygon colors");
    }
}