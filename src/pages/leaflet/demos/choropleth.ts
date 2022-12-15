import L from "leaflet";
import { shallowRef } from "vue";
import { useMap } from "../useMap";
import type { GeoJsonProperties } from "geojson";
import { geoJSONLayer } from "./geoJSON";
import { LeafletMouseEvent, PathOptions, StyleFunction } from "leaflet";
import { statesData } from "../constant";

export const choroplethLayer = shallowRef<L.GeoJSON<GeoJsonProperties>>();

export function addChoropleth() {
  const [map] = useMap();
  map.value!.setView([37.8, -96], 4);
  geoJSONLayer.value?.remove() && (geoJSONLayer.value = undefined);
  if (choroplethLayer.value) return;
  function getColor(d: number) {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }
  function style(feature: GeoJSON.Feature): PathOptions {
    return {
      fillColor: getColor(feature.properties!.density),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  function highlightFeature(e: LeafletMouseEvent) {
    var layer = e.target;

    layer.setStyle({
      weight: 3,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    (info as any).update(layer.feature.properties);
  }
  function resetHighlight(e: LeafletMouseEvent) {
    choroplethLayer.value?.resetStyle(e.target);
    (info as any).update();
  }
  function zoomToFeature(e: LeafletMouseEvent) {
    map.value!.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature: GeoJSON.Feature, layer: L.Layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }

  let info = new L.Control();

  info.onAdd = function (map: L.Map) {
    (this as any)._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
    (this as any).update();
    return (this as any)._div;
  };

  // method that we will use to update the control based on feature properties passed
  (info as any).update = function (props: any) {
    this._div.innerHTML =
      "<h4>US Population Density</h4>" +
      (props
        ? "<b>" +
          props.name +
          "</b><br />" +
          props.density +
          " people / mi<sup>2</sup>"
        : "Hover over a state");
  };

  info.addTo(map.value!);

  var legend = new L.Control({ position: "bottomright" });

  legend.onAdd = function (map: L.Map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(map.value!);

  choroplethLayer.value = L.geoJSON(statesData, {
    style: style as StyleFunction,
    onEachFeature: onEachFeature,
  }).addTo(map.value!);
}
