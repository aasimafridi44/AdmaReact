import { useEffect, useRef, useState } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from 'georaster'
import GeoRasterLayer from "georaster-layer-for-leaflet";
import proj4 from "proj4";
import { calculateColorForRaster, calculateValuesForLegend } from '../service/RasterCalcService'

window.proj4 = proj4;

const GeotiffLayer = ({ url,imageOverlay }) => {
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();
  const [loading, setLoading] = useState(true);
  
  const getPixelValue = (value, minValue, maxValue) => {
    if (!isNaN(value)) {
        return pixelValue(value, minValue, maxValue);
    } else {
        return '#f2f2f2'
    }
  }

  const pixelValue = (value, minValue, maxValue) => {
    let colorV;
    if (minValue !== maxValue) {
        colorV = calculateColorForRaster(value);
    } else {
        colorV = '#000000';
    }
    return colorV;
}
  

  useEffect(() => {
    setLoading(true);
    const container = context.layerContainer || context.map;
    

    // Fetch the GeoTIFF only when the URL changes
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Parse the GeoTIFF
        parseGeoraster(arrayBuffer)
          .then((georaster) => {
            
          let newgeorasterarr = 0;
          let _arrgeoraster = [];
          georaster.values[0].forEach((element) => {
              element.forEach((j) => {
                  if (!isNaN(j) && j !== 0) {
                      newgeorasterarr += j;
                      _arrgeoraster.push(j);
                  }
              });
          });

          const minValue = georaster['mins'];
          const maxValue = georaster['maxs'];
          
          const avgValue = Math.ceil(newgeorasterarr / _arrgeoraster.length);
          calculateValuesForLegend(avgValue, _arrgeoraster)

            // Create a new GeoRasterLayer
            geoTiffLayerRef.current = new GeoRasterLayer({
              georaster: georaster,
              pixelValuesToColorFn: (value) => {
                return getPixelValue(value, minValue, maxValue);
              },
              opacity: 0.7,
              resolution: 256,
              caching: true
            });

            // Add the new GeoRasterLayer to the map
            container.addLayer(geoTiffLayerRef.current);            
            map.fitBounds(geoTiffLayerRef.current.getBounds(), {padding: 10});
            
            // Set loading state to false once the new layer is rendered
            setLoading(false);
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
  }, [context.layerContainer, context.map, getPixelValue, map, url, imageOverlay]);

  // Only return null while loading is true
  return loading || imageOverlay ? null : <></>;
};

export default GeotiffLayer;
