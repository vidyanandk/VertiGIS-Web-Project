/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as projection from "@arcgis/core/geometry/projection";
// eslint-disable-next-line import/order
import Graphic from "@arcgis/core/Graphic";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import { operation } from "@vertigis/web/messaging";
import { ServiceBase } from "@vertigis/web/services";

interface NearbyFeature {
    layerTitle: string;
    attributes: Record<string, unknown>;
    geometry: __esri.Geometry;
}

export default class Project10Service extends ServiceBase {
    @operation("map.click.find-nearby-features")
    public async findNearbyFeatures(x: number, y: number, mapExtension: MapExtension): Promise<NearbyFeature[]> {
        try {
            console.log("🔍 Service called to find nearby features.");

            if (typeof x !== "number" || typeof y !== "number" || !mapExtension) {
                throw new Error("Invalid parameters provided");
            }

            const clickPoint = new Point({
                x,
                y,
                spatialReference: new SpatialReference({ wkid: 102100 }),
            });

            const buffer = geometryEngine.buffer(clickPoint, 100, "meters");

            if (!buffer) throw new Error("Buffer could not be created");

            let searchArea: Polygon;
            if (Array.isArray(buffer)) {
                if (buffer.length === 0) throw new Error("Empty buffer result");
                
                searchArea = buffer[0] as Polygon;
            } else {
                searchArea = buffer as Polygon;
            }

            if (!searchArea || !searchArea.rings) throw new Error("Invalid buffer geometry");

            // Graphics Layer Setup
            let graphicsLayer: GraphicsLayer | undefined = mapExtension.map?.layers.find(
                (layer: any) => layer.title === "Project10GraphicsLayer" && layer.type === "graphics"
            ) as GraphicsLayer | undefined;

            if (!graphicsLayer) {
                graphicsLayer = new GraphicsLayer({ title: "Project10GraphicsLayer" });
                mapExtension.map?.layers.add(graphicsLayer);
            }

            graphicsLayer.removeAll();

            const bufferSymbol = new SimpleFillSymbol({
                color: [0, 0, 255, 0.2],
                outline: {
                    color: [0, 0, 255],
                    width: 2,
                },
            });

            const bufferGraphic = new Graphic({
                geometry: searchArea,
                symbol: bufferSymbol,
            });

            graphicsLayer.add(bufferGraphic);

            //  Get Feature Layers
            const layers: FeatureLayer[] = [];
            mapExtension.map?.layers?.forEach((layer: any) => {
                if (layer?.type === "feature") layers.push(layer as FeatureLayer);
            });

            if (layers.length === 0) {
                await this.showNotification("No queryable feature layers found");
                return [];
            }

            const results: NearbyFeature[] = [];

            for (const layer of layers) {
                try {
                    if (!layer || !layer.spatialReference) continue;

                    let queryGeometry: Polygon = searchArea;

                    if (searchArea.spatialReference.wkid !== layer.spatialReference.wkid) {
                        await projection.load();
                        const projected = projection.project(searchArea, layer.spatialReference);
                        if (!projected) continue;
                        queryGeometry = projected as Polygon;
                    }

                    const query = layer.createQuery();
                    query.geometry = queryGeometry;
                    query.spatialRelationship = "intersects";
                    query.outFields = ["*"];
                    query.returnGeometry = true;

                    const queryResult = await layer.queryFeatures(query);

                    if (queryResult?.features) {
                        for (const feature of queryResult.features) {
                            if (feature?.geometry && feature?.attributes) {
                                results.push({
                                    layerTitle: layer.title || "Unknown Layer",
                                    attributes: feature.attributes,
                                    geometry: feature.geometry,
                                });

                                const marker = new SimpleMarkerSymbol({
                                    size: 6,
                                    style: "circle",
                                    color: [255, 0, 0],
                                });

                                const markerGraphic = new Graphic({
                                    geometry: feature.geometry,
                                    symbol: marker,
                                });

                                graphicsLayer.add(markerGraphic);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error querying ${layer.title}:`, error);
                }
            }

            // Log results and show popup
            console.log("Results to display in popup:", results);
            await this.showNotification(`Debug: ${results.length} feature(s) found`);

            if (results.length > 0) {
                await this.showFeaturePopup(results);
            } else {
                await this.showNotification("No features found within 100 meters");
            }

            return results;
        } catch (error) {
            console.error("❌ Error in findNearbyFeatures:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            await this.showNotification(`Error: ${errorMessage}`);
            throw error;
        }
    }

    private async showFeaturePopup(features: NearbyFeature[]): Promise<void> {
        try {
            if (!features || features.length === 0) {
                await this.showNotification("No features to show.");
                return;
            }

            const featuresToShow = features.slice(0, 10);
            let message = `Showing ${features.length} feature(s):\n`;

            for (let i = 0; i < featuresToShow.length; i++) {
                const feature = featuresToShow[i];
                message += `\n${i + 1}. Layer: ${feature.layerTitle || "Untitled Layer"}\n`;

                const attributes = Object.entries(feature.attributes || {});
                if (attributes.length === 0) {
                    message += "   No attributes available\n";
                    continue;
                }

                for (const [key, value] of attributes.slice(0, 5)) {
                    message += `   ${key}: ${value ?? "N/A"}\n`;
                }
            }

            if (features.length > 10) {
                message += `\n...and ${features.length - 10} more.`;
            }

            console.log("📢 Final popup message:\n", message);

            // // Display as notification
            // await this.messages.commands.ui.displayNotification.execute({
            //     title: "Nearby Features",
            //     message: message.trim(),
            // });

            // Fallback as alert
            await this.messages.commands.ui.alert.execute({
                message: message.trim(),
            });
        } catch (error) {
            console.error("❌ Popup failed:", error);
            await this.showNotification("Error showing popup.");
        }
    }

    public async showNotification(message: string): Promise<void> {
        try {
            await this.messages.commands.ui.displayNotification.execute({
                title: "Project 10 Service",
                message,
            });
        } catch (error) {
            console.error("Error displaying notification:", error);
        }
    }
}
