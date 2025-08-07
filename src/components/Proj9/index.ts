import type { LibraryRegistry } from "@vertigis/web/config";

import FeatureAddingCMModel from "./FeatureAddingCMModel";
import FeatureAddingCM from "./FeatureAddingCM";

export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string) {
    registry.registerComponent({
        name: "project-9-test",
        namespace: LAYOUT_NAMESPACE,
        getComponentType:() => FeatureAddingCM,
        itemType: "Project-9-model-model",
        title: "FeatureAddingComponent",
    })

    registry.registerModel({
         
        getModel:(config) => new FeatureAddingCMModel(config),
        itemType: "Project-9-model-model",

    })
    // registry.registerModel({
         
    //     getModel:(config) => new AddFeatureComponentModel(config),
    //     itemType: "Project-9-model",
    // });
}