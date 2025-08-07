import type Point from "@arcgis/core/geometry/Point";
import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
// import type { MapModel } from "@vertigis/web/mapping";
import * as messaging from "@vertigis/web/messaging";
import { importModel } from "@vertigis/web/models";
import {
    ComponentModelBase,
    serializable,
    type ComponentModelProperties,
} from "@vertigis/web/models";
import { inject } from "@vertigis/web/services";

import type Project10Service from "../../services/Service10/Project10Service";

interface ClickPointFinderModelProperties extends ComponentModelProperties {
    x?: number;
    y?: number;
}

@serializable
export default class ClickPointFinderModel extends ComponentModelBase<ClickPointFinderModelProperties> {
    x: number = 0;
    y: number = 0;

    @importModel("map-extension")
    mapExtension: MapExtension
    // map: MapModel;

    

    @inject("Project10Service-Id")
    project10Service: Project10Service;

    public async showNotification(message: string): Promise<void> {
        await this.messages.commands.ui.displayNotification.execute({
            title: "Click Point Finder",
            message,
        });
    }

    @messaging.command("click-point-finder.create")
    protected async createNew(location: messaging.HasGeometry): Promise<void> {
        const geometry = location.geometry as Point;
        
        // Validate geometry
        if (!geometry) {
            console.error("No geometry provided");
            await this.showNotification("Error: No geometry provided");
            return;
        }

        // Log geometry information
        // console.log("***************Geometry Viewpoint:", geometry.toString());
        console.log("&&&&&&&&&&&&&Geometry Viewpoint:", geometry.x, geometry.y);

        // Store coordinates
        this.x = geometry.x;
        this.y = geometry.y;

        try {
            // Call the service to find nearby features
            console.log("****************Finding nearby features for coordinates from service:", this.x, this.y);
            if (this.project10Service && this.mapExtension) {
                await this.project10Service.findNearbyFeatures(this.x, this.y, this.mapExtension);
            } else {
                throw new Error("Service or map extension not available");
            }

           
            // void this.showNotification(`Point Created: X: ${geometry.x}, Y: ${geometry.y}`);

            // Also show alert with coordinates
            await this.messages.commands.ui.alert.execute({
                message: `X: ${geometry.x}\nY: ${geometry.y}`,
            });

        } catch (error) {
            console.error("Error in createNew:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            // eslint-disable-next-line no-void
            void this.showNotification(`Error: ${errorMessage}`);
        }
    }
}