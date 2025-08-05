import type { LatLngLiteral } from "leaflet"

export type PolygonData = {
    id: string,
    coordinates: LatLngLiteral[],
    dataSource : string
}