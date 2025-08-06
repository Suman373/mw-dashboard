import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { LatLng, Polygon as LeafletPolygon } from 'leaflet';
import 'leaflet-draw';
import { useGlobalContext } from "../context/GlobalContext";

const polygonLayerMap = new Map<string, LeafletPolygon>();

const PolygonCreator = () => {
    const map = useMap();

    const { setState, state } = useGlobalContext();
    const { polygons } = state;

    const initializedRef = useRef(false);

    // polyon event handlers
    const onPolygonCreate = (latLngs: L.LatLng[], id: string, color: string) => {
        setState((prev) => ({
            ...prev,
            polygons: [
                ...prev.polygons,
                {
                    id,
                    coordinates: latLngs,
                    fillColor: color,
                    dataSource: "temperature_2m"
                }
            ]
        }));
    };

    const onPolygonDelete = (id: string) => {
        setState((prev) => ({
            ...prev,
            polygons: prev.polygons.filter((poly) => poly.id !== id)
        }));
    }

    const onPolygonEdit = (latLngs: L.LatLng[], id: string) => {
        setState((prev) => ({
            ...prev,
            polygons: prev.polygons.map((poly) =>
                poly.id === id ? { ...poly, coordinates: latLngs } : poly
            ),
        }));
    }
    useEffect(() => {
        if (initializedRef.current) return;

        polygons.forEach((polygonData) => {
            const latlngs: LatLng[] = polygonData.coordinates;

            const polygon = L.polygon(latlngs, {
                fillColor: polygonData.fillColor,
                fillOpacity: 0.5,
                color: "#333",
                weight: 2,
            });

            polygon.addTo(map);
            polygonLayerMap.set(polygonData.id, polygon);
        });

        initializedRef.current = true;
    }, [map, polygons]);

    useEffect(() => {
        polygons.forEach((polygonData) => {
            const polygonLayer = polygonLayerMap.get(polygonData.id);
            if (polygonLayer) {
                polygonLayer.setStyle({
                    fillColor: polygonData.fillColor,
                });
            }
        });
    }, [polygons]);

    useEffect(() => {
        const drawnPolygons = new L.FeatureGroup();
        map.addLayer(drawnPolygons);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnPolygons,
                edit: {
                    selectedPathOptions: {

                    }
                },
                remove: true,
            },
            draw: {
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polygon: {
                    allowIntersection: false,
                    // showArea: true,
                    guidelineDistance: 10,
                    maxPoints: 12,
                    repeatMode: false
                }
            },

        });

        map.addControl(drawControl);

        // create event on map
        map.on(L.Draw.Event.CREATED, function (e: any) {
            const { layerType, layer } = e;
            if (layerType === "polygon") {
                const latlngs: L.LatLng[] = layer.getLatLngs()[0];
                if (latlngs.length < 3) {
                    alert('Polygon must have at least 3 points.');
                    return;
                }
                const id = L.Util.stamp(layer).toString();
                drawnPolygons.addLayer(layer);
                polygonLayerMap.set(id, layer); 

                console.log("new poly created", latlngs, id);
                onPolygonCreate(latlngs, id, "#ffff");
            }
        });

        // delete event on map
        map.on(L.Draw.Event.DELETED, function (e: any) {
            const layers = e.layers;
            layers.eachLayer((layer: any) => {
                const id = L.Util.stamp(layer).toString();
                console.log(`poly ${id} deleted`);
                onPolygonDelete(id);
            });
        });

        // edit event on map
        map.on(L.Draw.Event.EDITED, function (e: any) {
            const { layers } = e;
            layers.eachLayer((layer: any) => {
                const id = L.Util.stamp(layer).toString();
                const latLngs: L.LatLng[] = layer.getLatLngs()[0];
                console.log("poly edited", id, latLngs);
                onPolygonEdit(latLngs, id);
            })

        })


        return () => {
            map.removeControl(drawControl);
            map.off(L.Draw.Event.CREATED);
            map.off(L.Draw.Event.DELETED);
            map.off(L.Draw.Event.EDITED);
            map.removeLayer(drawnPolygons);
        }
    }, [map]);

    return null;
}

export default PolygonCreator;