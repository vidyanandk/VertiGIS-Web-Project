// // import Point from "@arcgis/core/geometry/Point";
// // import type Color from "@arcgis/core/Color";
// // import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
// // import type { HasGeometry } from "@vertigis/web/messaging";
// // import { command } from "@vertigis/web/messaging";
// // import type { ComponentModelProperties, PropertyDefs } from "@vertigis/web/models";
// // import { ComponentModelBase, ModelBase, importModel, serializable } from "@vertigis/web/models";
// // import { inject } from "@vertigis/web/services";
// // import Graphic from "esri/Graphic";
// // import FeatureLayer from "esri/layers/FeatureLayer";

// // interface Project9Properties extends ComponentModelProperties {
// //     x?: number;
// //     y?: number;
// // }

// // /**
// //  * Serializable model to store point-related properties.
// //  */
// // // @serializable
// // // class ModeltoSavePoints extends ModelBase {
// // //     title: string;
// // //     color: Color;
// // //     geometry: Point;

// // //     constructor(init?: Partial<ModeltoSavePoints>) {
// // //         super();
// // //         Object.assign(this, init);
// // //     }
// // // }

// // /**
// //  * Main model that handles map click, layer insertion, and feature creation.
// //  */
// // @serializable
// // export default class Project9Model extends ComponentModelBase<Project9Properties> {
// //     private _nextId = 1;

// //     x?: number;
// //     y?: number;

// //     @importModel("map-extension")
// //     mapExtension: MapExtension;

// //     // @inject("Map-Click-Service")
// //     // mapClickService: Project10Service;

// //     /**
// //      * Called when a user clicks on the map.
// //      * Saves coordinates and optionally alerts the user.
// //      */
// //     // @command("points-of-interest.create")
// //     // async createNew(location: HasGeometry): Promise<void> {
// //     //     const id = this._nextId++;
// //     //     const poi = new ModeltoSavePoints({
// //     //         id: id.toString(),
// //     //         geometry: location.geometry as Point,
// //     //     });

// //     //     const { x, y } = location.geometry as { x: number; y: number };
// //     //     this.x = x;
// //     //     this.y = y;

// //     //     // Optional service logic (currently commented out)
// //     //     // await this.mapClickService.findNearbyFeatures(this.x, this.y, this.mapExtension);

// //     //     await this.messages.commands.ui.alert.execute({
// //     //         message: `X: ${x}\nY: ${y}`,
// //     //     });
// //     // }

// //     /**
// //      * Fetches the DevMAINLOCATIONS feature layers and inserts a point feature.
// //      */
// //     public async addFeatureLayer(): Promise<void> {
// //         console.log("Adding Location layers...");
// //         try {
// //             const response = await fetch(
// //                 "https://ckmvlf3.amantyatech.com/server/rest/services/Hosted/vidya_layer/FeatureServer?f=json"
// //             );
// //             if (!response.ok) {
// //                 throw new Error(`Failed to fetch layer list: ${response.statusText}`);
// //             }

// //             const data = await response.json();
// //             const layers = data.layers || [];
// //            console.log("Layers fetched:", layers);
// //             for (const layer of layers) {
// //                 const layerId = `vidya_layer-${layer.id}`;
// //                 const existing = this.mapExtension?.map.findLayerById(layerId);
// //                 if (existing) {
// //                     console.log(`Layer ${layerId} already added, skipping.`);
// //                     continue;
// //                 }

// //                 const featureLayer = new FeatureLayer({
// //                     url: `https://ckmvlf3.amantyatech.com/server/rest/services/Hosted/vidya_layer/FeatureServer/${layer.id}`,
// //                     id: layerId,
// //                     title: layer.name || `Layer ${layer.id}`,
// //                     visible: true,
// //                     outFields: ["*"],
// //                 });

// //                 await this.messages.commands.map.addLayers.execute({
// //                     layers: featureLayer,
// //                     maps: this.mapExtension,
// //                 });

// //                 console.log("################Added DevMAINLOCATIONS layer:", featureLayer.title);

// //                 if (this.x && this.y) {
// //                     const point = new Point({
// //                         x: this.x,
// //                         y: this.y,
// //                         spatialReference: { wkid: 3857 },
// //                     });

// //                     const newFeature = new Graphic({
// //                         geometry: point,
// //                         attributes: {
// //                             Name: "Sample Feature",
// //                             Description: "Added from model",
// //                         },
// //                     });

// //                     try {
// //                         const result = await featureLayer.applyEdits({
// //                             addFeatures: [newFeature],
// //                         });

// //                         if (result.addFeatureResults?.[0].objectId) {
// //                             console.log(
// //                                 `Feature added with Object ID: ${result.addFeatureResults[0].objectId}`
// //                             );
// //                         } else {
// //                             console.warn("Feature add did not return ObjectID.");
// //                         }
// //                     } catch (editError) {
// //                         console.error("Failed to add feature to layer:", editError);
// //                     }
// //                 }
// //             }

// //             console.log("All DevMAINLOCATIONS layers added and features inserted.");
// //         } catch (error) {
// //             console.error("Error adding DevMAINLOCATIONS layers:", error);
// //         }
// //     }

// //     protected _getSerializableProperties(): PropertyDefs<Project9Properties> {
// //         return {
// //             ...super._getSerializableProperties(),
// //             x: {
// //                 serializeModes: ["initial"],
// //             },
// //             y: {
// //                 serializeModes: ["initial"],
// //             },
// //         };
// //     }
// // }




import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import type { ComponentModelProperties, PropertyDefs } from "@vertigis/web/models";
import { ComponentModelBase, importModel, serializable } from "@vertigis/web/models";

interface Project9Properties extends ComponentModelProperties {
    x?: number;
    y?: number;
}

@serializable
export default class Project9Model extends ComponentModelBase<Project9Properties> {
    @importModel("map-extension")
    mapExtension: MapExtension;

    x?: number = -13734139.920726957; // Default hardcoded x
    y?: number = 6176640.59879214;    // Default hardcoded y

    /**
     * Adds the feature layer and a hardcoded point feature to it.
     */
    public async addFeatureLayer(): Promise<void> {
        console.log("Adding feature layer and point...");

        try {
            const response = await fetch(
                "https://desktop-85sdjag/server/rest/services/Hosted/DevMAINLOCATIONS/FeatureServer?f=json"
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch layer list: ${response.statusText}`);
            }

            const data = await response.json();
            const layers = data.layers || [];
            console.log("Layers fetched:", layers);

            for (const layer of layers) {
                const layerId = `dev-main-layer-${layer.id}`;
                const existing = this.mapExtension?.map.findLayerById(layerId);
                if (existing) {
                    console.log(`Layer ${layerId} already exists, skipping.`);
                    continue;
                }

                const featureLayer = new FeatureLayer({
                    url: `https://desktop-85sdjag/server/rest/services/Hosted/DevMAINLOCATIONS/FeatureServer/${layer.id}`,
                    id: layerId,
                    title: layer.name || `Layer ${layer.id}`,
                    visible: true,
                    outFields: ["*"],
                });

                // eslint-disable-next-line no-await-in-loop
                await this.messages.commands.map.addLayers.execute({
                    layers: featureLayer,
                    maps: this.mapExtension,
                });

                console.log(`Added layer: ${featureLayer.title}`);

                const point = new Point({
                    x: this.x,
                    y: this.y,
                    spatialReference: { wkid: 3857 }, // Web Mercator
                });

                const graphic = new Graphic({
                    geometry: point,
                    attributes: {
                        Name: "Hardcoded Feature",
                        Description: "Added manually using hardcoded geometry",
                    },
                });

                try {
                    // eslint-disable-next-line no-await-in-loop
                    const result = await featureLayer.applyEdits({
                        addFeatures: [graphic],
                    });

                    if (result.addFeatureResults?.[0].objectId) {
                        console.log(`Feature added with ObjectID: ${result.addFeatureResults[0].objectId}`);
                        // eslint-disable-next-line no-await-in-loop
                        await this.messages.commands.ui.alert.execute({
                            message: `Feature successfully added with Object ID: ${result.addFeatureResults[0].objectId}`,
                        });
                    } else {
                        console.warn("No ObjectID returned after adding feature.");
                    }
                } catch (e) {
                    console.error("Failed to apply edits:", e);
                }
            }

        } catch (err) {
            console.error("Error in addFeatureLayer:", err);
        }
    }

    protected _getSerializableProperties(): PropertyDefs<Project9Properties> {
        return {
            ...super._getSerializableProperties(),
            x: {
                serializeModes: ["initial"],
            },
            y: {
                serializeModes: ["initial"],
            },
        };
    }
}

