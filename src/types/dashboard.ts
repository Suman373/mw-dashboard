import type { PolygonData } from "./polygon";


export interface DashboardState  {
    range: [number, number],
    formattedRange: [string, string],
    selectedDays: number,
    polygons: PolygonData[],
}
