/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/member-ordering */
import type { MapModel } from "@vertigis/web/mapping";
import {
  ComponentModelBase,
  serializable,
  type ComponentModelProperties,
  importModel,
} from "@vertigis/web/models";
import FeatureLayer from "esri/layers/FeatureLayer";

import AddFeatureComponentModel from "./AddFeatureComponentModel";

export type FeatureManagerModelProperties = ComponentModelProperties;

@serializable
export default class FeatureManagerModel extends ComponentModelBase<FeatureManagerModelProperties> {
  @importModel("map-extension")
  map: MapModel;

  isAddFeatureDialogOpen: boolean = false;
  addFeatureModel: AddFeatureComponentModel | null = null;

  protected async _onInitialize(): Promise<void> {
    await super._onInitialize();
    
    // Initialize the AddFeatureComponentModel
    this.addFeatureModel = new AddFeatureComponentModel();
    await this.addFeatureModel.initialize();
  }

  /**
   * Open the Add Feature dialog
   */
  async openAddFeatureDialog(): Promise<void> {
    try {
      // Ensure location layers are loaded before opening dialog
      await this.loadLocationLayers();
      
      // Initialize the add feature model if not already done
      if (!this.addFeatureModel) {
        this.addFeatureModel = new AddFeatureComponentModel();
        await this.addFeatureModel.initialize();
      }
      
      this.isAddFeatureDialogOpen = true;
      
    } catch (error) {
      console.error("Error opening add feature dialog:", error);
      await this.messages.commands.ui.alert.execute({
        message: `Error opening feature dialog: ${error}`,
      });
    }
  }

  /**
   * Close the Add Feature dialog
   */
  closeAddFeatureDialog(): void {
    this.isAddFeatureDialogOpen = false;
  }

  /**
   * Load location layers similar to AddLocationLayerModel
   */
  async loadLocationLayers(): Promise<void> {
    try {
      const response = await fetch(
        "https://desktop-85sdjag/server/rest/services/Hosted/DevMAINLOCATIONS/FeatureServer?f=json"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch layer list: ${response.statusText}`);
      }

      const data = await response.json();
      const layers = data.layers || [];
      console.log("Loading location layers:", layers);

      let addedLayers = 0;

      for (const layer of layers) {
        const layerId = `dev-main-layer-${layer.id}`;
        
        // Check if layer already exists by iterating through layers
        const existing = this.map?.view?.map?.layers?.find((mapLayer: any) => mapLayer.id === layerId);
        if (existing) {
          continue;
        }

        const featureLayer = new FeatureLayer({
          url: `https://desktop-85sdjag/server/rest/services/Hosted/DevMAINLOCATIONS/FeatureServer/${layer.id}`,
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

        await this.messages.commands.map.addLayers.execute({
          layers: featureLayer,
          maps: this.map,
        });

        addedLayers++;
      }

      if (addedLayers > 0) {
        await this.messages.commands.ui.alert.execute({
          message: `${addedLayers} location layers added successfully!`,
        });
      } else {
        await this.messages.commands.ui.alert.execute({
          message: "All location layers are already loaded",
        });
      }

      // Refresh the AddFeatureComponent model to pick up new layers
      if (this.addFeatureModel) {
        await this.addFeatureModel.loadLocationLayers();
      }

    } catch (error) {
      console.error("Error adding Location layers:", error);
      await this.messages.commands.ui.alert.execute({
        message: `Error adding location layers: ${error}`,
      });
    }
  }

  /**
   * Get current feature layers count
   */
  getFeatureLayersCount(): number {
    if (!this.map?.view?.map) {
      return 0;
    }

    let count = 0;
    this.map.view.map.layers.forEach((layer: any) => {
      if (layer instanceof FeatureLayer && layer.id?.startsWith('dev-main-layer-')) {
        count++;
      }
    });

    return count;
  }

  /**
   * Remove all location layers
   */
  async removeAllLocationLayers(): Promise<void> {
    try {
      if (!this.map?.view?.map) {
        return;
      }

      const layersToRemove: any[] = [];
      this.map.view.map.layers.forEach((layer: any) => {
        if (layer instanceof FeatureLayer && layer.id?.startsWith('dev-main-layer-')) {
          layersToRemove.push(layer);
        }
      });

      for (const layer of layersToRemove) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.map.view.map.remove(layer);
      }

      if (layersToRemove.length > 0) {
        await this.messages.commands.ui.alert.execute({
          message: `Removed ${layersToRemove.length} location layers`,
        });

        // Refresh the AddFeatureComponent model
        if (this.addFeatureModel) {
          await this.addFeatureModel.loadLocationLayers();
        }
      }

    } catch (error) {
      console.error("Error removing location layers:", error);
      await this.messages.commands.ui.alert.execute({
        message: `Error removing layers: ${error}`,
      });
    }
  }
}