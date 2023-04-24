import L from "leaflet";
import { useMap } from "../useMap";
import * as d3 from "d3";

import collection from "./jsons/geojson-d3.json";

// code is from: 
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

export function addD3Layer() {
  const [map] = useMap();
  if (!map.value) return;

  map.value.setView({ lat: 40.72239, lng: -73.99517 }, 18);

  const svg = d3.select(map.value?.getPanes().overlayPane!).append("svg");
  const g = svg.append("g").attr("class", "leaflet-zoom-hide");

  const featuresdata = collection.features.filter((d) => {
    return d.properties.id === "route1";
  });
  console.log(collection, featuresdata);

  const transform = d3.geoTransform({
    point: projectPoint,
  });

  const d3path = d3.geoPath().projection(transform);

  function projectPoint(
    this: d3.GeoTransformPrototype & {
      stream: d3.GeoStream;
    },
    x: number,
    y: number
  ) {
    const point = map.value!.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function applyLatLngToLayer(d: any) {
    var y = d.geometry.coordinates[1];
    var x = d.geometry.coordinates[0];
    return map.value!.latLngToLayerPoint(new L.LatLng(y, x));
  }

  const toLine = d3
    .line<any>()
    .curve(d3.curveLinear)
    .x((d) => {
      return applyLatLngToLayer(d).x;
    })
    .y((d) => {
      return applyLatLngToLayer(d).y;
    });

  const ptFeatures = g
    .selectAll("circle")
    .data(featuresdata)
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("class", "waypoints");

  const linePath = g
    .selectAll(".lineConnect")
    .data([featuresdata])
    .enter()
    .append("path")
    .attr("class", "lineConnect");

  const marker = g
    .append("circle")
    .attr("r", 10)
    .attr("id", "marker")
    .attr("class", "travelMarker");

  const originANDdestination = [featuresdata[0], featuresdata[17]];
  const begend = g
    .selectAll(".drinks")
    .data(originANDdestination)
    .enter()
    .append("circle")
    .attr("class", ".drinks")
    .attr("r", 5)
    .style("fill", "red")
    .style("opacity", "1");

  const text = g
    .selectAll("text")
    .data(originANDdestination)
    .enter()
    .append("text")
    .text((d) => d.properties.name)
    .attr("class", "locnames")
    .attr("y", (d) => -10);

  function reset() {
    console.log("reset");
    const bounds = d3path.bounds(collection as any),
      topLeft = bounds[0],
      bottomRight = bounds[1];

    text.attr(
      "transform",
      (d) => `translate(${applyLatLngToLayer(d).x}, ${applyLatLngToLayer(d).y})`
    );

    begend.attr(
      "transform",
      (d) => `translate(${applyLatLngToLayer(d).x}, ${applyLatLngToLayer(d).y})`
    );

    ptFeatures.attr(
      "transform",
      (d) => `translate(${applyLatLngToLayer(d).x}, ${applyLatLngToLayer(d).y})`
    );

    marker.attr("transform", () => {
      const y = featuresdata[0].geometry.coordinates[1];
      const x = featuresdata[0].geometry.coordinates[0];
      return `translate(${
        map.value!.latLngToLayerPoint(new L.LatLng(y, x)).x
      },${map.value!.latLngToLayerPoint(new L.LatLng(y, x)).y})`;
    });
    // Setting the size and location of the overall SVG container
    svg
      .attr("width", bottomRight[0] - topLeft[0] + 120)
      .attr("height", bottomRight[1] - topLeft[1] + 120)
      .style("left", topLeft[0] - 50 + "px")
      .style("top", topLeft[1] - 50 + "px");

    linePath.attr("d", toLine);
    g.attr("transform", `translate(${-topLeft[0] + 50},${-topLeft[1] + 50})`);
  }

  function transition() {
    linePath
      .transition()
      .duration(7500)
      .attrTween("stroke-dasharray", tweenDash)
      .on("end", function () {
        d3.select(this).call(transition);
      });
  }

  function tweenDash() {
    return function (t: number) {
      const l = linePath.node()?.getTotalLength() as number;
      

      const interpolate = d3.interpolateString(`0,${l}`, `${l},${l}`);
      const marker = d3.select("#marker");
      const p = linePath.node()?.getPointAtLength(t * l)!;

      marker.attr("transform", `translate(${p.x}, ${p.y})`);
      // console.log(interpolate(t));
      return interpolate(t);
    };
  }

  map.value!.on("zoom", reset);
  reset();
  transition();
  console.log(linePath);
}
