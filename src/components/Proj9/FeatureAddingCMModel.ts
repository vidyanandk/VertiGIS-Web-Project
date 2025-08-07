// import Point from "@arcgis/core/geometry/Point";
// import type Color from "@arcgis/core/Color";
// import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
// import type { HasGeometry } from "@vertigis/web/messaging";
// import { command } from "@vertigis/web/messaging";
// import type { ComponentModelProperties, PropertyDefs } from "@vertigis/web/models";
// import { ComponentModelBase, ModelBase, importModel, serializable } from "@vertigis/web/models";
// import { inject } from "@vertigis/web/services";
// import Graphic from "esri/Graphic";
// import FeatureLayer from "esri/layers/FeatureLayer";


// interface Project9Properties extends ComponentModelProperties {
//     x?: number;
//     y?: number;
// }

// /**
//  * Serializable model to store point-related properties.
//  */
// // @serializable
// // class ModeltoSavePoints extends ModelBase {
// //     title: string;
// //     color: Color;
// //     geometry: Point;

// //     constructor(init?: Partial<ModeltoSavePoints>) {
// //         super();
// //         Object.assign(this, init);
// //     }
// // }

// /**
//  * Main model that handles map click, layer insertion, and feature creation.
//  */
// @serializable
// export default class Project9Model extends ComponentModelBase<Project9Properties> {
//     private _nextId = 1;

//     x?: number;
//     y?: number;

//     @importModel("map-extension")
//     mapExtension: MapExtension;

//     // @inject("Map-Click-Service")
//     // mapClickService: Project10Service;

//     /**
//      * Called when a user clicks on the map.
//      * Saves coordinates and optionally alerts the user.
//      */
//     // @command("points-of-interest.create")
//     // async createNew(location: HasGeometry): Promise<void> {
//     //     const id = this._nextId++;
//     //     const poi = new ModeltoSavePoints({
//     //         id: id.toString(),
//     //         geometry: location.geometry as Point,
//     //     });

//     //     const { x, y } = location.geometry as { x: number; y: number };
//     //     this.x = x;
//     //     this.y = y;

//     //     // Optional service logic (currently commented out)
//     //     // await this.mapClickService.findNearbyFeatures(this.x, this.y, this.mapExtension);

//     //     await this.messages.commands.ui.alert.execute({
//     //         message: `X: ${x}\nY: ${y}`,
//     //     });
//     // }

//     /**
//      * Fetches the DevMAINLOCATIONS feature layers and inserts a point feature.
//      */
//     public async addFeatureLayer(): Promise<void> {
//         console.log("Adding Location layers...");
//         try {
//             const response = await fetch(
//                 "https://ckmvlf3.amantyatech.com/server/rest/services/Hosted/vidya_layer/FeatureServer?f=json"
//             );
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch layer list: ${response.statusText}`);
//             }

//             const data = await response.json();
//             const layers = data.layers || [];
//            console.log("Layers fetched:", layers);
//             for (const layer of layers) {
//                 const layerId = `vidya_layer-${layer.id}`;
//                 const existing = this.mapExtension?.map.findLayerById(layerId);
//                 if (existing) {
//                     console.log(`Layer ${layerId} already added, skipping.`);
//                     continue;
//                 }

//                 const featureLayer = new FeatureLayer({
//                     url: `https://ckmvlf3.amantyatech.com/server/rest/services/Hosted/vidya_layer/FeatureServer/${layer.id}`,
//                     id: layerId,
//                     title: layer.name || `Layer ${layer.id}`,
//                     visible: true,
//                     outFields: ["*"],
//                 });

//                 await this.messages.commands.map.addLayers.execute({
//                     layers: featureLayer,
//                     maps: this.mapExtension,
//                 });

//                 console.log("################Added DevMAINLOCATIONS layer:", featureLayer.title);

//                 if (this.x && this.y) {
//                     const point = new Point({
//                         x: this.x,
//                         y: this.y,
//                         spatialReference: { wkid: 3857 },
//                     });

//                     const newFeature = new Graphic({
//                         geometry: point,
//                         attributes: {
//                             Name: "Sample Feature",
//                             Description: "Added from model",
//                         },
//                     });

//                     try {
//                         const result = await featureLayer.applyEdits({
//                             addFeatures: [newFeature],
//                         });

//                         if (result.addFeatureResults?.[0].objectId) {
//                             console.log(
//                                 `Feature added with Object ID: ${result.addFeatureResults[0].objectId}`
//                             );
//                         } else {
//                             console.warn("Feature add did not return ObjectID.");
//                         }
//                     } catch (editError) {
//                         console.error("Failed to add feature to layer:", editError);
//                     }
//                 }
//             }

//             console.log("All DevMAINLOCATIONS layers added and features inserted.");
//         } catch (error) {
//             console.error("Error adding DevMAINLOCATIONS layers:", error);
//         }
//     }

//     protected _getSerializableProperties(): PropertyDefs<Project9Properties> {
//         return {
//             ...super._getSerializableProperties(),
//             x: {
//                 serializeModes: ["initial"],
//             },
//             y: {
//                 serializeModes: ["initial"],
//             },
//         };
//     }
// }





import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import type { ComponentModelProperties } from "@vertigis/web/models";
import { ComponentModelBase, importModel, serializable } from "@vertigis/web/models";

interface FeatureAddingCMProperties extends ComponentModelProperties {}

@serializable
export default class FeatureAddingCMModel extends ComponentModelBase<FeatureAddingCMProperties> {
    @importModel("map-extension")
    mapExtension: MapExtension;

    public async addFeatureLayer(): Promise<void> {
        try {
            console.log("📍 Adding feature layer...");

            const featureServiceUrl =
                "https://ckmvlf3.amantyatech.com/server/rest/services/Hosted/vidya_layer/FeatureServer";
            const layerId = 0; // You can change this if needed
            const layerUrl = `${featureServiceUrl}/${layerId}`;
            const featureLayerId = `vidya_layer-${layerId}`;

            // Check if layer is already added
            const existing = this.mapExtension.map.findLayerById(featureLayerId);
            let featureLayer: FeatureLayer;

            if (existing) {
                console.log(`✅ Feature layer '${featureLayerId}' already added.`);
                featureLayer = existing as FeatureLayer;
            } else {
                // Add the layer
                featureLayer = new FeatureLayer({
                    url: layerUrl,
                    id: featureLayerId,
                    title: "Vidya Sample Layer",
                    outFields: ["*"],
                    visible: true,
                });

                await this.messages.commands.map.addLayers.execute({
                    layers: featureLayer,
                    maps: this.mapExtension,
                });

                console.log("✅ Feature layer added to map.");
            }

            // 🎯 Hardcoded point
            const point = new Point({
                x: 8474510.6,
                y: 2282641.3,
                spatialReference: { wkid: 3857 }, // Web Mercator
            });

            const newFeature = new Graphic({
                geometry: point,
                attributes: {
                    Name: "Manually Added",
                    Description: "Created using applyEdits",
                },
            });

            const result = await featureLayer.applyEdits({
                addFeatures: [newFeature],
            });

            const objectId = result.addFeatureResults?.[0]?.objectId;

            if (objectId) {
                console.log(`✅ Feature added with ObjectID: ${objectId}`);

                // Add manually to map for immediate visibility
                const symbol = new SimpleMarkerSymbol({
                    color: [0, 255, 0],
                    size: 10,
                    style: "diamond",
                });

                const displayGraphic = new Graphic({
                    geometry: point,
                    symbol,
                });

                // Add to a GraphicsLayer for display
                let graphicsLayer = this.mapExtension.map.allLayers.find(
                    (layer) => layer.type === "graphics" && layer.id === "temp-graphics"
                );
                if (!graphicsLayer) {
                    const GraphicsLayer = (await import("@arcgis/core/layers/GraphicsLayer")).default;
                    graphicsLayer = new GraphicsLayer({ id: "temp-graphics" });
                    this.mapExtension.map.add(graphicsLayer);
                }
                (graphicsLayer as any).add(displayGraphic);

                await this.messages.commands.ui.alert.execute({
                    message: `Feature successfully added! ObjectID: ${objectId}`,
                });
            } else {
                console.warn("⚠️ Feature was not added. No objectId returned.");
                await this.messages.commands.ui.alert.execute({
                    message: "Feature add failed. No ObjectID returned.",
                });
            }
        } catch (error) {
            console.error("❌ Error adding feature layer:", error);
            await this.messages.commands.ui.alert.execute({
                message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            });
        }
    }
}
