import type { LibraryRegistry } from "@vertigis/web/config";

import LayerListProject from "./LayerListProject";
import LayerListProjectModel from "./LayerListProjectModel";

export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string) {
    registry.registerComponent({
        name: "project-2-layer-list",
        namespace: LAYOUT_NAMESPACE,
        getComponentType:() => LayerListProject,
        itemType: "Project-2-model-part",
        title: "Layer List Display",
    })

    registry.registerModel({
        getModel:(config) => new LayerListProjectModel(config),
        itemType: "Project-2-model-part"
    })
}