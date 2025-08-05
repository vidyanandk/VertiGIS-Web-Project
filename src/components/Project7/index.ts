
import type { LibraryRegistry } from "@vertigis/web/config";

import InterComponentCommunication1 from "./InterComponentCommunication1";
import InterComponentModel from "./InterComponentModel";

export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string) {
    registry.registerComponent({
        name: "project-7",
        namespace: LAYOUT_NAMESPACE,
        getComponentType:() => InterComponentCommunication1,
        itemType: "Project-7-model",
        title: "OtherComponentOpening",
    })

    registry.registerModel({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        getModel:(config) => new InterComponentModel(config),
        itemType: "Project-7-model",

    })
}