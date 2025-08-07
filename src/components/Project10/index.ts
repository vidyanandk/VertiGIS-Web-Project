import type { LibraryRegistry } from "@vertigis/web/config";

import ClickPointFinder from "./ClickPointFinder";
import ClickPointFinderModel from "./ClickPointFinderModel";


export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string){
    registry.registerComponent({
        name: "Project-10",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => ClickPointFinder,
        itemType: "Project-10-click-point-model",
        title: "Project-10 Click Point Finder",
    });
    registry.registerModel({
        getModel: (config) => new ClickPointFinderModel(config),
        itemType: "Project-10-click-point-model",
    });
    registry.registerCommand({
        name: "click-point-finder.create",
        itemType: "Project-10-click-point-model",
    })
}