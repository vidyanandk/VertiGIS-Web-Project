import type { LibraryRegistry } from "@vertigis/web/config";

// import FeatureAddingCM from "./FeatureAddingCM";
// import AddFeatureComponentModel from "./AddFeatureComponentModel";
import FeatureAddingCMModel from "./FeatureAddingCMModel";
import FeatureManager from "./FeatureManager";

export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string) {
    registry.registerComponent({
        name: "project-9",
        namespace: LAYOUT_NAMESPACE,
        getComponentType:() => FeatureManager,
        itemType: "Project-9-model",
        title: "FeatureAddingComponent",
    })

    registry.registerModel({
         
        getModel:(config) => new FeatureAddingCMModel(config),
        itemType: "Project-9-model",

    })
    // registry.registerModel({
         
    //     getModel:(config) => new AddFeatureComponentModel(config),
    //     itemType: "Project-9-model",
    // });
}