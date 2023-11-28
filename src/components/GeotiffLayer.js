import { useEffect, useRef } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from 'georaster'
import GeoRasterLayer from "georaster-layer-for-leaflet";
import proj4 from "proj4";
import { calculateColorForRaster, calculateValuesForLegend } from '../service/RasterCalcService'

window.proj4 = proj4;

const GeotiffLayer = ({ url, options }) => {
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();

  const pixelValuesToColorFn = (values) => {
    // Check if values array has at least two elements (NIR and RED)
    if (!Array.isArray(values) || values.length < 2) {
      console.log('Invalid values array:', values);
      return 'rgba(0, 0, 0, 0)'; // Transparent for invalid data
    }
  
    const [nir, red] = values;
  
    // Check if NIR is zero or very close to zero
    if (Math.abs(nir) < 1e-6) {
      console.log('Transparent for zero or close to zero NIR');
      return 'rgba(0, 0, 0, 0)'; // Transparent for zero NIR
    }
  
    // Check if RED is undefined or very close to zero
    if (typeof red === 'undefined' || Math.abs(red) < 1e-6) {
      console.log('Transparent for undefined or close to zero RED');
      return 'rgba(0, 0, 0, 0)'; // Transparent for undefined or zero RED
    }
  
    const ndvi = (nir - red) / (nir + red);
  
    // Check if NDVI is NaN (division by zero)
    if (isNaN(ndvi)) {
      console.log('NDVI is NaN. NIR:', nir, 'RED:', red);
      return 'rgba(0, 0, 0, 0)'; // Transparent for NaN values
    }
  
    console.log('NDVI:', ndvi);
  
    // Map NDVI to RGB color scale
    const r = Math.min(255, Math.max(0, Math.round((ndvi + 1) * 127.5)));
    const g = 255 - r;
    const b = 0;
  
    console.log('RGB:', r, g, b);
  
    return `rgba(${r},${g},${b}, 1)`;
  };
  
  const getPixelValue = (value, minValue, maxValue) => {
    if (!isNaN(value)) {
        return pixelValue(value, minValue, maxValue);
    } else {
        return '#FCE51C'
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
    const container = context.layerContainer || context.map;

    // Fetch the GeoTIFF only when the URL changes
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Parse the GeoTIFF
        parseGeoraster(arrayBuffer)
          .then((georaster) => {
            console.log("georaster:", georaster);
            // Remove the previous GeoRasterLayer instance
            if (geoTiffLayerRef.current) {
              container.removeLayer(geoTiffLayerRef.current);
            }

          //Raster image calc.---
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
