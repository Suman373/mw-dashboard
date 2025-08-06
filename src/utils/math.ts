import type { LatLng } from "leaflet";
import type { DataSource } from "../types/datasource";

export const getPolygonCentroid = (coordinates: LatLng[]) => {
    let latSum = 0;
    let longSum = 0;
    const total = coordinates.length;
    for (let i = 0; i < coordinates.length; i++) {
        latSum += coordinates[i].lat;
        longSum += coordinates[i].lng;
    }
    return {
        lat: latSum / total,
        lng: longSum / total
    }
}


export const getAverageTemperature = (temps: [number] | any) => {
    let tempSum = 0;
    if (temps.length > 0) {
        for (let i = 0; i < temps.length; i++) {
            tempSum += temps[i];
        }
        return tempSum / temps.length;
    }
}


export const getColorForTemperature = (dataSources: DataSource[], avgTemp: number) => {
    for (const rule of dataSources[0].colorRules) {
        const match = rule.condition.match(/(<=|>=|<|>|==)\s*(\d+(\.\d+)?)/); // regex to get operator and numeric val from condition
        if (!match) continue;
        const [, operator, valueStr] = match;
        const val = parseFloat(valueStr);

        if ((operator === ">" && avgTemp > val) ||
            (operator === ">=" && avgTemp >= val) ||
            (operator === "<" && avgTemp < val) ||
            (operator === "<=" && avgTemp <= val) ||
            (operator === "==" && avgTemp === val)) {
            return rule.color;
        }
    }
    return "#000";
}