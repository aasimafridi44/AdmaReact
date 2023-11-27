import { useEffect, useRef } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from 'georaster'
import GeoRasterLayer from "georaster-layer-for-leaflet";

const GeotiffLayer = ({ url, options }) => {
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    // Fetch the GeoTIFF only when the URL changes
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Parse the GeoTIFF
        parseGeoraster(arrayBuffer)
          .then((georaster) => {
            // Remove the previous GeoRasterLayer instance
            if (geoTiffLayerRef.current) {
              container.removeLayer(geoTiffLayerRef.current);
            }

            // Create a new GeoRasterLayer
            geoTiffLayerRef.current = new GeoRasterLayer({
              georaster: georaster,
              opacity: 0.7,
              resolution: 256
            });

            // Add the new GeoRasterLayer to the map
            container.addLayer(geoTiffLayerRef.current);

            // Fit the map bounds to the GeoRasterLayer
            map.fitBounds(geoTiffLayerRef.current.getBounds());
          })
          .catch((error) => {
            console.error('Error parsing georaster:', error);
          });
      });

    // Cleanup: Remove the GeoRasterLayer when the component is unmounted
    return () => {
      if (geoTiffLayerRef.current) {
        container.removeLayer(geoTiffLayerRef.current);
      }
    };
  }, [context.layerContainer, context.map, map, url]);

  return null;
};

export default GeotiffLayer;
