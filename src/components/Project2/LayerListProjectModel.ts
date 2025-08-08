// import {
//     ComponentModelBase,
//     ComponentModelProperties,
//     serializable,
//     PropertyDefs,
// } from "@vertigis/web/models";

// interface LayerListProjectModelProperties
//     extends ComponentModelProperties {
//     layerId?: string;
// }


// @serializable
// export default class LayerListProjectModel extends ComponentModelBase<LayerListProjectModelProperties> {
//     layerId: string;

    
//     protected _getSerializableProperties(): PropertyDefs<LayerListProjectModelProperties> {
//         const props = super._getSerializableProperties();
//         return {
//             ...props,
//             layerId: {
//                 serializeModes: ["initial"],
//                 default: "Default Value",
//             },
//         };
//     }
// }




import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import { ComponentModelBase, serializable, importModel, type PropertyDefs, type ComponentModelProperties as BaseComponentModelProperties } from "@vertigis/web/models";

import { getFeatureServiceLayers, convertToFeatureLayer } from "../../comman/utlis/RestAPIUsed";
interface ComponentModelProperties extends BaseComponentModelProperties {
    stylemodel?: boolean;
    propertiesModel?: boolean;
    maindialogmodel?: boolean;
}


interface Layer {
    id: number;
    name: string;
    [key: string]: any;
    layer:any;
    symbolStyle:string;
    symbolColor:string;
    outlineColor:string;
    symbolSize: number;
    symbolAngle: number;
    xOffset: number;
    yOffset:number;
    outlineWidth:number;
    lineStyle:string;
    geo?: string;

    
    

}

@serializable
export default class LayerListProjectModel extends ComponentModelBase<ComponentModelProperties> {
    featureServiceLayers: Layer[] = [];
    layer:any;
    symbolStyle:string = "";
    symbolColor:string = "";
    outlineColor:string = "";
    symbolSize: number;
    symbolAngle: number;
    xOffset:number;
    yOffset:number;
    outlineWidth:number;
    lineStyle:string = "";
    geo?: string;
    stylemodel: boolean = false;
    selectedLayer: any = null;
    propertiesModel: boolean = false;
    maindialogmodel: boolean = false;

    @importModel("map-extension")
    mapExtension: MapExtension;
    

    async fetchLayersFromFeatureService(): Promise<void> {
        try {
            this.featureServiceLayers = await getFeatureServiceLayers();
            console.log("Fetched layers:", this.featureServiceLayers);
        } catch (error) {
            console.error("Error fetching layers:", error);
        }
    }

    async addLayerToMap(layers: Layer[]): Promise<void> {
        if (!this.mapExtension?.map) {
            console.error("Map extension is not initialized.");
            return;
        }

        // Map layers to FeatureLayer objects and set visibility to true
        const featureLayers = layers.map(layer => {
            const featureLayer = convertToFeatureLayer(layer);
            this.geo = featureLayer.geometryType
            
            
            this.layer = featureLayer
            featureLayer.visible = true;
          
            console.log(`Adding layer: ${layer.name}, Visible: ${featureLayer.visible}`);
       
           
            return featureLayer;
        });
        

        try {
            await this.messages.commands.map.addLayers.execute({
                layers: featureLayers,
                maps: this.mapExtension,
            });
            console.log("Layers added to map:", featureLayers);
        } catch (error) {
            console.error("Error adding layers to map:", error);
        }
    }

    async removeLayerFromMap(layerId: number): Promise<void> {
        if (!this.mapExtension?.map) {
            console.error("Map extension is not initialized.");
            return;
        }

        const map = this.mapExtension?.map;
        const layer = map.findLayerById(`layer-${layerId}`);
        if (layer) {
            try {
                await this.messages.commands.map.removeLayers.execute({
                    layers: [layer],
                    maps: this.mapExtension,
                });
                console.log(`Layer with ID ${layerId} removed from map`);
            } catch (error) {
                console.error(`Error removing layer with ID ${layerId}:`, error);
            }
        } else {
            console.log(`Layer with ID ${layerId} not found on map`);
        }
    }




    protected _getSerializableProperties(): PropertyDefs<ComponentModelProperties> {
        const props = super._getSerializableProperties();
        return {
            ...props,
            stylemodel: {
                serializeModes: ["initial"],
                default: false,
            },
            propertiesModel: {
                serializeModes: ["initial"],
                default: false,
            },
            maindialogmodel: {
                serializeModes: ["initial"],
                default: false,
            },
        }
    }
}
