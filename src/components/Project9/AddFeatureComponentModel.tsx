/* eslint-disable @typescript-eslint/no-base-to-string */
import type { MapModel } from "@vertigis/web/mapping";
import {
  ComponentModelBase,
  serializable,
  type ComponentModelProperties,
  importModel,
} from "@vertigis/web/models";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import Polygon from "esri/geometry/Polygon";
import Polyline from "esri/geometry/Polyline";
import FeatureLayer from "esri/layers/FeatureLayer";

export type AddFeatureComponentModelProperties = ComponentModelProperties;

interface GeometryInput {
  type: "point" | "polygon" | "polyline";
  longitude?: number;
  latitude?: number;
  coordinates?: number[][] | number[][][];
}

interface FeatureAttributes {
  Name?: string;
  Description?: string;
  Category?: string;
  CreatedBy?: string;
  CreatedDate?: string;
  [key: string]: any;
}

@serializable
export default class AddFeatureComponentModel extends ComponentModelBase<AddFeatureComponentModelProperties> {
  
  @importModel("map-extension")
  map: MapModel;

  featureServiceUrl: string = "https://desktop-85sdjag/server/rest/services/Hosted/DevMAINLOCATIONS/FeatureServer";
  selectedGeometryType: "point" | "polyline" | "polygon" = "point";
  isLoading: boolean = false;
  featureLayers: FeatureLayer[] = [];
  selectedLayer: FeatureLayer | null = null;
  totalFeatures: number | null = null;

  async initialize(): Promise<void> {
    await this.loadLocationLayers();
  }

  setGeometryType(type: "point" | "polyline" | "polygon"): void {
    this.selectedGeometryType = type;
  }

  selectLayer(layer: FeatureLayer | null): void {
    this.selectedLayer = layer;
    if (layer) {
      // eslint-disable-next-line no-void
      void this.updateFeatureCount();
    }
  }

  /**
   * Load the DevMAINLOCATIONS feature layers similar to AddLocationLayerModel
   */
  async loadLocationLayers(): Promise<void> {
    try {
      this.isLoading = true;
      
      const response = await fetch(`${this.featureServiceUrl}?f=json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch layer list: ${response.statusText}`);
      }

      const data = await response.json();
      const layers = data.layers || [];
      console.log("Location layers:", layers);

      const featureLayers: FeatureLayer[] = [];

      for (const layer of layers) {
        const layerId = `dev-main-layer-${layer.id}`;
        
        // Check if layer already exists in the map
        const existing = this.map?.view?.map?.layers?.find((mapLayer: any) => mapLayer.id === layerId);
        
        let featureLayer: FeatureLayer;
        
        if (existing && existing instanceof FeatureLayer) {
          featureLayer = existing;
        } else {
          // Create new feature layer
          featureLayer = new FeatureLayer({
            url: `${this.featureServiceUrl}/${layer.id}`,
            id: layerId,
            title: layer.name || `Location Layer ${layer.id}`,
            visible: true,
            outFields: ["*"],
            popupTemplate: {
              title: "{Name}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "Name",
                      label: "Name"
                    },
                    {
                      fieldName: "Description", 
                      label: "Description"
                    },
                    {
                      fieldName: "Category",
                      label: "Category"
                    }
                  ]
                }
              ]
            }
          });

          // Add to map if not existing
          // eslint-disable-next-line no-await-in-loop
          await this.messages.commands.map.addLayers.execute({
            layers: featureLayer,
            maps: this.map,
          });
        }

        featureLayers.push(featureLayer);
      }

      this.featureLayers = featureLayers;
      
      if (featureLayers.length > 0) {
        this.selectedLayer = featureLayers[0]; // Select the first layer by default
        await this.updateFeatureCount();
      }

      await this.showNotification("Location layers loaded successfully!", "success");
      
    } catch (error) {
      console.error("Error loading Location layers:", error);
      
      await this.showNotification(`Error loading location layers: ${error}`, "error");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Add a feature to the selected layer with specified geometry and attributes
   */
  async addFeatureToLayer(geometryInput: GeometryInput, attributes: FeatureAttributes): Promise<boolean> {
    try {
      if (!this.selectedLayer) {
        await this.showNotification("Please select a feature layer first", "warning");
        return false;
      }

      this.isLoading = true;
      
      // Create geometry based on input type
      const geometry = this.createGeometry(geometryInput);
      
      if (!geometry) {
        await this.showNotification("Failed to create geometry", "error");
        return false;
      }

      // Create the graphic/feature
      const feature = new Graphic({
        geometry,
        attributes: {
          ...attributes,
          CreatedBy: "User",
          CreatedDate: new Date().toISOString()
        }
      });

      // Add feature to the layer using applyEdits
      const result = await this.selectedLayer.applyEdits({
        addFeatures: [feature]
      });

      if (result.addFeatureResults && result.addFeatureResults.length > 0) {
        const addResult = result.addFeatureResults[0];
        
        if (!addResult.error) {
          await this.updateFeatureCount();
          await this.showNotification(`Feature added successfully with ObjectID: ${addResult.objectId}`, "success");
          
          // Optionally zoom to the new feature
          await this.zoomToFeature(addResult.objectId);
          
          return true;
        } else {
           
          throw new Error(addResult.error?.message || "Unknown error adding feature");
        }
      } else {
        throw new Error("No results returned from addFeatures operation");
      }

    } catch (error) {
      console.error("Error adding feature:", error);
      
      await this.showNotification(`Error adding feature: ${error}`, "error");
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create hardcoded feature similar to FeatureCreatorModel
   */
  async createHardcodedFeature(attributes: FeatureAttributes): Promise<void> {
    if (!this.selectedLayer) {
      await this.showNotification("Please select a feature layer first", "warning");
      return;
    }

    try {
      this.isLoading = true;

      // Create hardcoded geometry based on selected type using reference coordinates
      const geometry = this.createHardcodedGeometry();

      if (!geometry) {
        await this.showNotification("Failed to create geometry", "error");
        return;
      }

      // Create the feature graphic
      const feature = new Graphic({
        // eslint-disable-next-line object-shorthand
        geometry: geometry,
        attributes: {
          Name: attributes.Name || "Hardcoded Feature",
          Description: attributes.Description || "Created programmatically",
          Category: attributes.Category || this.selectedGeometryType,
          CreatedBy: "System",
          CreatedDate: new Date().toISOString(),
        },
      });

      // Add the feature to the selected layer
      const result = await this.selectedLayer.applyEdits({
        addFeatures: [feature],
      });

      if (result.addFeatureResults?.[0]?.objectId) {
        const objectId = result.addFeatureResults[0].objectId;
        await this.showNotification(
          `Hardcoded feature added successfully with Object ID: ${objectId}`,
          "success"
        );
        
        await this.updateFeatureCount();
        console.log(`Feature added with Object ID: ${objectId}`);
      } else {
        await this.showNotification("Feature added but no Object ID returned", "warning");
      }

    } catch (error) {
      console.error("Failed to create hardcoded feature:", error);
      await this.showNotification("Failed to create feature", "error");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create geometry object from input parameters
   */
  private createGeometry(geometryInput: GeometryInput): Point | Polygon | Polyline | null {
    try {
      switch (geometryInput.type) {
        case "point":
          if (geometryInput.longitude !== undefined && geometryInput.latitude !== undefined) {
            return new Point({
              longitude: geometryInput.longitude,
              latitude: geometryInput.latitude,
              spatialReference: { wkid: 4326 }
            });
          }
          break;

        case "polygon":
          if (geometryInput.coordinates) {
            return new Polygon({
              rings: geometryInput.coordinates as number[][][],
              spatialReference: { wkid: 4326 }
            });
          }
          break;

        case "polyline":
          if (geometryInput.coordinates) {
            return new Polyline({
              paths: [geometryInput.coordinates as number[][]],
              spatialReference: { wkid: 4326 }
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error creating geometry:", error);
    }
    
    return null;
  }

  /**
   * Create hardcoded geometry similar to FeatureCreatorModel
   */
  private createHardcodedGeometry(): Point | Polygon | Polyline | null {
    // Use hardcoded coordinates similar to reference implementation
    const x = 0;
    const y = 0;
    const spatialReference = { wkid: 3857 };

    switch (this.selectedGeometryType) {
      case "point":
        return new Point({
          // eslint-disable-next-line object-shorthand
          x: x,
          // eslint-disable-next-line object-shorthand
          y: y,
          // eslint-disable-next-line object-shorthand
          spatialReference: spatialReference,
        });

      case "polyline":
        // Create a simple line
        { const lineCoords = [
          [x - 100, y - 100],
          [x + 100, y + 100],
        ];
        return new Polyline({
          paths: [lineCoords],
          // eslint-disable-next-line object-shorthand
          spatialReference: spatialReference,
        }); }

      case "polygon":
        // Create a simple rectangle
        { const polygonCoords = [
          [
            [x - 100, y - 100],
            [x + 100, y - 100],
            [x + 100, y + 100],
            [x - 100, y + 100],
            [x - 100, y - 100], // Close the polygon
          ],
        ];
        return new Polygon({
          rings: polygonCoords,
          // eslint-disable-next-line object-shorthand
          spatialReference: spatialReference,
        }); }

      default:
        return null;
    }
  }

  /**
   * Clear all features from the selected layer
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async clearAllFeatures(): Promise<void> {
    try {
      if (!this.selectedLayer) {
        await this.showNotification("Please select a feature layer first", "warning");
        return;
      }

      this.isLoading = true;
      
      // Query all features
      const query = this.selectedLayer.createQuery();
      const featureSet = await this.selectedLayer.queryFeatures(query);
      
      if (featureSet.features.length === 0) {
        await this.showNotification("No features to delete", "info");
        return;
      }

      // Delete all features
      const result = await this.selectedLayer.applyEdits({
        deleteFeatures: featureSet.features
      });

      const deletedCount = result.deleteFeatureResults?.filter(r => !r.error).length || 0;
      
      await this.updateFeatureCount();
      await this.showNotification(`Successfully deleted ${deletedCount} features`, "success");

    } catch (error) {
      console.error("Error clearing features:", error);
      await this.showNotification(`Error clearing features: ${error}`, "error");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Zoom to all features in the selected layer
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async zoomToAllFeatures(): Promise<void> {
    try {
      if (!this.selectedLayer || !this.map?.view) {
        return;
      }

      const query = this.selectedLayer.createQuery();
      query.returnGeometry = true;
      
      const featureSet = await this.selectedLayer.queryFeatures(query);
      
      if (featureSet.features.length > 0) {
        await this.map.view.goTo(featureSet.features);
        await this.showNotification("Zoomed to all features", "info");
      } else {
        await this.showNotification("No features to zoom to", "warning");
      }

    } catch (error) {
      console.error("Error zooming to features:", error);
      await this.showNotification(`Error zooming to features: ${error}`, "error");
    }
  }

  /**
   * Zoom to a specific feature by ObjectID
   */
  private async zoomToFeature(objectId: number): Promise<void> {
    try {
      if (!this.selectedLayer || !this.map?.view) {
        return;
      }

      const query = this.selectedLayer.createQuery();
      query.objectIds = [objectId];
      query.returnGeometry = true;
      
      const featureSet = await this.selectedLayer.queryFeatures(query);
      
      if (featureSet.features.length > 0) {
        await this.map.view.goTo(featureSet.features[0]);
      }

    } catch (error) {
      console.error("Error zooming to feature:", error);
    }
  }

  /**
   * Update the total feature count for the selected layer
   */
  private async updateFeatureCount(): Promise<void> {
    try {
      if (!this.selectedLayer) {
        this.totalFeatures = null;
        return;
      }

      const query = this.selectedLayer.createQuery();
      query.returnGeometry = false;
      query.where = "1=1";
      
      const result = await this.selectedLayer.queryFeatureCount(query);
      this.totalFeatures = result;

    } catch (error) {
      console.error("Error getting feature count:", error);
      this.totalFeatures = null;
    }
  }

  /**
   * Show notification using the same pattern as reference models
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async showNotification(message: string, type: "success" | "warning" | "error" | "info"): Promise<void> {
    try {
      await this.messages.commands.ui.alert.execute({
        // eslint-disable-next-line object-shorthand
        message: message,
      });
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }
}