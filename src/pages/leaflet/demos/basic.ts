import L, { LeafletMouseEvent } from "leaflet";
import { shallowRef } from "vue";
import { useMap } from "../useMap";

const basicLayer = shallowRef();

export function setBasicMarker() {
  const [map] = useMap();
  if (!map.value) return;

  map.value.setView([51.508, -0.11], 13);
  if (basicLayer.value) return;

  var circle = L.circle([51.508, -0.11], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map.value!);

  var marker = L.marker([51.5, -0.09]).addTo(map.value!);

  var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ]).addTo(map.value!);

  marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  circle.bindPopup("I am a circle.");
  polygon.bindPopup("I am a polygon.");

  // function onMapClick(e) {
  //   alert("You clicked the map at " + e.latlng);
  // }

  // map.on("click", onMapClick);
  // marker.on("click", onMapClick);
  var popup = L.popup();

  function onMapClick(e: LeafletMouseEvent) {
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

  map.value!.on("click", onMapClick);
  basicLayer.value = {
    marker,
    circle,
    polygon,
  };
}
