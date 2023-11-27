import { useEffect, useRef } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from 'georaster'
import GeoRasterLayer from "georaster-layer-for-leaflet";

const GeotiffLayer = ({ url, options }) => {
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();
  console.log('GeotiffLayer')
  useEffect(() => {
    console.log('url', url)
    const container = context.layerContainer || context.map;    
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {

        parseGeoraster(arrayBuffer).then((georaster) => {        
          options.georaster = georaster;
          geoTiffLayerRef.current = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            resolution: 256
        });

          container.addLayer(geoTiffLayerRef.current);
          map.fitBounds(geoTiffLayerRef.current.getBounds());

        }).catch((error) => {
          console.error('Error parsing georaster:', error);
        });
      })

      return () => {
        container.removeLayer(geoTiffLayerRef.current);
      };
  }, [context.layerContainer, context.map, map, options, url])

  return null;
}
export default GeotiffLayer;