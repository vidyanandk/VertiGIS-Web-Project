// // import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

// export default async function getFeatureLayer(url: string): Promise<any []> {
//   try {
//       const res= await fetch(url);
//       if (!res.ok) {
//             throw new Error(`HTTP error! status: ${res.status}`);
//     }
//       const data = await res.json();
//       console.log("Fetched Layers:", data.layers);
//       return data.layers || [];

//   } catch (error) {
//     console.error("Error fetching Layers:", error);
//     // throw error;
//     return [];
//   }
// }   




import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export  async function getFeatureServiceLayers(): Promise<any[]> {
    try {
        const response = await fetch(
            // "https://10.10.34.18:8082/rest/services/CONNECTMASTER_LIVE/FeatureServer?f=json"
            "https://ckmvlf3.amantyatech.com:8091/rest/services/CONNECTMASTER_ProjectVersion-61/FeatureServer?f=json"
        );
        const data = await response.json();
        return data.layers || [];
    } catch (error) {
        console.error("Error fetching layers:", error);
        return [];
    }
}

const mapEsriGeometryType = (type: string) => {
    switch (type) {
        case "esriGeometryPoint":
            return "point";
        case "esriGeometryPolygon":
            return "polygon";
        case "esriGeometryPolyline":
            return "polyline";
        case "esriGeometryMultipoint":
            return "multipoint";
        case "esriGeometryMultipatch":
            return "multipatch";
        case "esriGeometryMesh":
            return "mesh";
        default:
            return undefined;
    }
};

// Updated function: Don't convert to FeatureLayer by default, only when necessary
export const convertToFeatureLayer = (layer: { id: number; name?: string; geometryType?: string }) => {
    // const url = `https://10.10.34.18:8082/rest/services/CONNECTMASTER_LIVE/FeatureServer/${layer.id}`;
    const url=`https://ckmvlf3.amantyatech.com:8091/rest/services/CONNECTMASTER_ProjectVersion-61/FeatureServer/${layer.id}`;
    console.log("Layer URL:", url);
     
    console.log("ak",url);
    return new FeatureLayer({
        url,
        id: `layer-${layer.id}`,
        title: layer.name || `Layer ${layer.id}`,
        visible: false, // default to hidden
        geometryType: mapEsriGeometryType(layer.geometryType),
        outFields: ["*"],
        
    });
};

// Function to get metadata of a single layer based on layer ID
export const getLayerMetadata = async (layerId: number) => {
    try {
        const response = await fetch(
            // `http://10.10.34.18:8082/rest/services/CONNECTMASTER_LIVE/FeatureServer/${layerId}?f=json`
            `https://ckmvlf3.amantyatech.com:8091/rest/services/CONNECTMASTER_ProjectVersion-61/FeatureServer/${layerId}/query?f=json`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching layer metadata:", error);
        return null;
    }
};
