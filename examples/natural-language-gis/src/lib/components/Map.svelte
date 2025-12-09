<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import type { FeatureCollection } from "geojson";

  let { features } = $props<{ features: any[] }>();

  let mapContainer: HTMLDivElement;
  let map: maplibregl.Map;

  // Convert input features to a standard GeoJSON FeatureCollection
  let featureCollection = $derived.by(() => {
    const fc: FeatureCollection = {
      type: "FeatureCollection",
      features: features.map((f) => ({
        type: "Feature",
        geometry:
          typeof f.geojson === "string" ? JSON.parse(f.geojson) : f.geojson,
        properties: f.properties,
      })),
    };
    return fc;
  });

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [12.3731, 51.3397], // Leipzig coordinates (approximate center of the dataset)
      zoom: 12,
    });

    map.on("load", () => {
      // Add source for our data
      map.addSource("data", {
        type: "geojson",
        data: featureCollection,
      });

      // Add fill layer for polygons
      map.addLayer({
        id: "data-fill",
        type: "fill",
        source: "data",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.5,
        },
        filter: ["==", "$type", "Polygon"],
      });

      // Add line layer for lines and polygon outlines
      map.addLayer({
        id: "data-line",
        type: "line",
        source: "data",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2,
        },
      });

      // Add circle layer for points
      map.addLayer({
        id: "data-circle",
        type: "circle",
        source: "data",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ef4444",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
        filter: ["==", "$type", "Point"],
      });

      // Add popup on click
      map.on("click", "data-fill", (e) => showPopup(e));
      map.on("click", "data-line", (e) => showPopup(e));
      map.on("click", "data-circle", (e) => showPopup(e));

      // Change cursor on hover
      const layers = ["data-fill", "data-line", "data-circle"];
      layers.forEach((layer) => {
        map.on(
          "mouseenter",
          layer,
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
      });

      updateData();
    });
  });

  onDestroy(() => {
    if (map) map.remove();
  });

  function showPopup(
    e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }
  ) {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const props = feature.properties;

    // Format properties as a simple list
    const html = `
      <div class="text-sm max-h-60 overflow-y-auto">
        <h3 class="font-bold mb-2">Properties</h3>
        <table class="w-full text-left">
          <tbody>
            ${Object.entries(props || {})
              .map(
                ([k, v]) =>
                  `<tr class="border-b"><td class="font-semibold pr-2 py-1">${k}</td><td class="py-1">${v}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
  }

  function updateData() {
    if (!map || !map.getSource("data")) return;

    (map.getSource("data") as maplibregl.GeoJSONSource).setData(
      featureCollection
    );

    // Fit bounds if we have features
    if (featureCollection.features.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      featureCollection.features.forEach((feature) => {
        const geometry = feature.geometry;
        if (geometry.type === "Point") {
          bounds.extend(geometry.coordinates as [number, number]);
        } else if (geometry.type === "Polygon") {
          geometry.coordinates[0].forEach((coord) => {
            bounds.extend(coord as [number, number]);
          });
        } else if (geometry.type === "MultiPolygon") {
          geometry.coordinates.forEach((poly) =>
            poly[0].forEach((coord) => bounds.extend(coord as [number, number]))
          );
        } else if (geometry.type === "LineString") {
          geometry.coordinates.forEach((coord) =>
            bounds.extend(coord as [number, number])
          );
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
      }
    }
  }

  // React to changes in features
  $effect(() => {
    // Access featureCollection to track dependency
    const fc = featureCollection;
    updateData();
  });
</script>

<div
  class="w-full h-[600px] bg-slate-100 rounded border overflow-hidden relative"
>
  <div bind:this={mapContainer} class="w-full h-full"></div>
  {#if features.length === 0}
    <div
      class="absolute inset-0 flex items-center justify-center bg-white/50 pointer-events-none z-10"
    >
      <span class="text-gray-600 font-medium bg-white px-4 py-2 rounded shadow"
        >No data to display</span
      >
    </div>
  {/if}
</div>
