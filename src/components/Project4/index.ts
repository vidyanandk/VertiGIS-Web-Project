import { LibraryRegistry } from "@vertigis/web/config";

import GeometryAlert from "./GeometryAlert";
import GeometryAlertModel from "./GeometryAlertModel";


export default function (registry: LibraryRegistry, LAYOUT_NAMESPACE: string) {
    

    registry.registerComponent({
        name: "geometry-alert-project4",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => GeometryAlert,
        itemType: "geometry-alert-model",
        title: "Geometry Alert Component",
    });
    registry.registerModel({
        getModel: (config) => new GeometryAlertModel(config),
        itemType: "geometry-alert-model",
    });
    registry.registerCommand({
        name: "geometry-alert.create",
        itemType: "geometry-alert-model",
    })
}