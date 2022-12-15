import type L from "leaflet";
import { shallowRef } from "vue";

const map = shallowRef<L.Map>();

export function useMap() {
  const setMap = (val?: L.Map) => {
    map.value = val;
  };
  return [map, setMap] as [typeof map, typeof setMap];
}
