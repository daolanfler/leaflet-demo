import L from 'leaflet'
import { shallowRef } from "vue";
import { useMap } from "../useMap";
import { choroplethLayer } from './choropleth';

export const geoJSONLayer = shallowRef<L.GeoJSON<any>>();

export function addGeoJSON() {
  const [map] = useMap()
  
  map.value!.panTo({ lat: 39, lng: -104 }).setZoom(4);

  choroplethLayer.value?.remove() && (choroplethLayer.value = undefined);
  if (geoJSONLayer.value) return;
  var geojsonFeature: GeoJSON.Feature = {
    type: "Feature",
    properties: {
      name: "Coors Field",
      amenity: "Baseball Stadium",
      popupContent: "This is where the Rockies play!",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.99404, 39.75621],
    },
  };

  // multiple lines
  var myLines: GeoJSON.Geometry[] = [
    {
      type: "LineString",
      coordinates: [
        [-100, 40],
        [-105, 45],
        [-110, 55],
      ],
    },
    {
      type: "LineString",
      coordinates: [
        [-105, 40],
        [-110, 45],
        [-115, 55],
      ],
    },
  ];

  var myStyle = {
    color: "#ff7800",
    weight: 2,
    opacity: 0.65,
  };

  // @ts-ignore
  L.geoJSON([geojsonFeature, ...myLines], { style: myStyle }).addTo(map.value!);

  var states: GeoJSON.Feature[] = [
    {
      type: "Feature",
      properties: { party: "Republican" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-104.05, 48.99],
            [-97.22, 48.98],
            [-96.58, 45.94],
            [-104.03, 45.94],
            [-104.05, 48.99],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { party: "Democrat" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-109.05, 41.0],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.0],
          ],
        ],
      },
    },
  ];

  // @ts-ignore
  L.geoJSON(states, {
    style: (feature?: GeoJSON.Feature<GeoJSON.GeometryObject, any>) => {
      switch (feature?.properties.party) {
        case "Republican":
          return { color: "#ff0000" };
        case "Democrat":
          return { color: "#0000ff" };
      }
      return {};
    },
  }).addTo(map.value!);

  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };

  L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
  }).addTo(map.value!);

  function onEachFeature(feature: GeoJSON.Feature, layer: L.Layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }

  // var geojsonFeature = {
  //   type: "Feature",
  //   properties: {
  //     name: "Coors Field",
  //     amenity: "Baseball Stadium",
  //     popupContent: "This is where the Rockies play!"
  //   },
  //   geometry: {
  //     type: "Point",
  //     coordinates: [-104.99404, 39.75621]
  //   }
  // };

  L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature,
  }).addTo(map.value!);

  var someFeatures = [
    {
      type: "Feature",
      properties: {
        name: "Coors Field",
        show_on_map: true,
      },
      geometry: {
        type: "Point",
        coordinates: [-104.99404, 39.75621],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Busch Field",
        show_on_map: true,
      },
      geometry: {
        type: "Point",
        coordinates: [-104.98404, 39.74621],
      },
    },
  ];

  // @ts-ignore
  geoJSONLayer.value = L.geoJSON(someFeatures, {
    filter: function (feature: GeoJSON.Feature, layer: L.Layer) {
      return feature.properties!.show_on_map;
    },
  }).addTo(map.value!);
}
