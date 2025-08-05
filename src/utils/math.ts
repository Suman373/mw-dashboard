import type { LatLng } from "leaflet";

export const getPolygonCentroid = (coordinates: LatLng[])=>{
    let latSum = 0;
    let longSum = 0;
    const total = coordinates.length;
    for(let i=0;i<coordinates.length;i++){
        latSum += coordinates[i].lat;
        longSum += coordinates[i].lng;
    }
    return {
        lat: latSum / total,
        lng: longSum / total
    }   
}