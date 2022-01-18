<template>
  <div class="wrapper">
    <div id="map"></div>
    <div style="margin-top: 12px">
      <NButton @click="basicMarker">Baic</NButton>
      <NButton @click="addGeoJSON">GeoJSON</NButton>
      <NButton @click="choropleth">choropleth</NButton>
    </div>
  </div>
</template>

<script lang="ts">
import L from "leaflet";
import "proj4";
import "proj4leaflet";
import "leaflet.chinatmsproviders";
import "leaflet/dist/leaflet.css";
import { MAPBOX_TOKEN, MAP_CENTER, statesData } from "./constant";
import {NButton} from "naive-ui"
import Vue from "vue";

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-48340269kjk9

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png")
// });

export default {
  name: "LeafletIndex",
  components: {NButton},
  data() {
    return {
      /** @type {L.Map} */
      map: null
    };
  },
  methods: {
    choropleth() {
      const map = this.map;
      map.setView([37.8, -96], 4);
      function getColor(d) {
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
      function style(feature) {
        return {
          fillColor: getColor(feature.properties.density),
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7
        };
      }

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
        info.update(layer.feature.properties);
      }
      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
      }
      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      var info = L.control();

      info.onAdd = function (map) {
        this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      info.update = function (props) {
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

      info.addTo(map);

      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function (map) {
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

      legend.addTo(map);

      const geojson = L.geoJSON(statesData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
    },
    addGeoJSON() {
      const map = this.map;
      var geojsonFeature = {
        type: "Feature",
        properties: {
          name: "Coors Field",
          amenity: "Baseball Stadium",
          popupContent: "This is where the Rockies play!"
        },
        geometry: {
          type: "Point",
          coordinates: [-104.99404, 39.75621]
        }
      };

      // multiple lines
      var myLines = [
        {
          type: "LineString",
          coordinates: [
            [-100, 40],
            [-105, 45],
            [-110, 55]
          ]
        },
        {
          type: "LineString",
          coordinates: [
            [-105, 40],
            [-110, 45],
            [-115, 55]
          ]
        }
      ];

      var myStyle = {
        color: "#ff7800",
        weight: 2,
        opacity: 0.65
      };

      L.geoJSON([geojsonFeature, ...myLines], { style: myStyle }).addTo(map);

      var states = [
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
                [-104.05, 48.99]
              ]
            ]
          }
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
                [-109.05, 41.0]
              ]
            ]
          }
        }
      ];

      L.geoJSON(states, {
        style: function (feature) {
          switch (feature.properties.party) {
            case "Republican":
              return { color: "#ff0000" };
            case "Democrat":
              return { color: "#0000ff" };
          }
        }
      }).addTo(map);

      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      L.geoJSON(geojsonFeature, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(map);

      function onEachFeature(feature, layer) {
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
        onEachFeature: onEachFeature
      }).addTo(map);

      var someFeatures = [
        {
          type: "Feature",
          properties: {
            name: "Coors Field",
            show_on_map: true
          },
          geometry: {
            type: "Point",
            coordinates: [-104.99404, 39.75621]
          }
        },
        {
          type: "Feature",
          properties: {
            name: "Busch Field",
            show_on_map: true
          },
          geometry: {
            type: "Point",
            coordinates: [-104.98404, 39.74621]
          }
        }
      ];

      L.geoJSON(someFeatures, {
        filter: function (feature, layer) {
          return feature.properties.show_on_map;
        }
      }).addTo(map);

      map.panTo({ lat: 39, lng: -104 }).setZoom(8);
    },
    basicMarker() {
      var map = this.map;
      if (!this.map) {
        map = L.map("map").setView([51.508, -0.11], 13);
        this.map = map;
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: MAPBOX_TOKEN
          }
        ).addTo(map);
      }

      var circle = L.circle([51.508, -0.11], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500
      }).addTo(map);

      var marker = L.marker([51.5, -0.09]).addTo(map);

      var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
      ]).addTo(map);

      marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
      circle.bindPopup("I am a circle.");
      polygon.bindPopup("I am a polygon.");

      // function onMapClick(e) {
      //   alert("You clicked the map at " + e.latlng);
      // }

      // map.on("click", onMapClick);
      // marker.on("click", onMapClick);
      var popup = L.popup();

      function onMapClick(e) {
        // popup
        //   .setLatLng(e.latlng)
        //   // .setContent("You clicked the map at " + e.latlng.toString())
        //   .setContent(
        //     Vue.createApp({
        //       render() {
        //         return <div>Hello, this is a vue component!</div>;
        //       }
        //     }).mount().$el
        //   )
        //   .openOn(map);
      }

      map.on("click", onMapClick);
    }
  },
  created() {},
  mounted() {
    this.basicMarker();
  }
};
</script>

<style lang="css" scoped>
#map {
  height: calc(100vh - 60px);
}
</style>

<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.info h4 {
  margin: 0 0 5px;
  color: #777;
}

.legend {
  line-height: 18px;
  color: #555;
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
</style>
