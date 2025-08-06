import type { LatLng } from "leaflet"

export type PolygonData = {
    id: string,
    coordinates: LatLng[],
    dataSource : string,
    fillColor: string
}