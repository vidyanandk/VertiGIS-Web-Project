// import type { MapModel } from "@vertigis/web/mapping";
import type Point from "@arcgis/core/geometry/Point";
import type { MapModel } from "@vertigis/web/mapping";
import * as messaging from "@vertigis/web/messaging";
// eslint-disable-next-line import/order
import { importModel } from "@vertigis/web/models";
// import { useWatchAndRerender } from "@vertigis/web/ui";

import {
    ComponentModelBase,
    serializable,
    type ComponentModelProperties,
  
} from "@vertigis/web/models";

interface GeometryAlertModelProperties extends ComponentModelProperties {
    geometry?: any;
}


@serializable
export default class GeometryAlertModel extends ComponentModelBase<GeometryAlertModelProperties> {
   
    @importModel("map-extension")
    map: MapModel;
    mapExtension : messaging.HasMaps;

     public async showNotification(message: string, x: number): Promise<void> {
    await this.messages.commands.ui.displayNotification.execute({
      title: "Feature Info",
      message,
    });
  }
   
   @messaging.command("geometry-alert.create")
protected async ShowProperties(location: messaging.HasGeometry): Promise<void> {
    const geometry = location.geometry as Point;
    // Assuming geometry is a Point, you can access its properties like this:
    if (geometry) {
     // eslint-disable-next-line @typescript-eslint/no-base-to-string
     console.log("***************Geometry Viewpoint:", geometry.toString());
}
 console.log("&&&&&&&&&&&&&Geometry Viewpoint:", geometry.x, geometry.y);

    // You can also use the geometry in your application logic here
    // eslint-disable-next-line no-void
    void this.showNotification(`Geometry Alert: X: ${geometry.x}, Y: ${geometry.y}`, geometry.x);

}



}
