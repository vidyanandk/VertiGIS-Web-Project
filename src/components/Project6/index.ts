import { LibraryRegistry } from "@vertigis/web/config";
import BasemapOpacitySlidebar from "./BasemapOpacitySlidebar";
import BasemapOpacitySlidebarModel from "./BasemapOpacitySlidebarModel";


export default function (registry: LibraryRegistry,LAYOUT_NAMESPACE:string) {
    registry.registerComponent({
        name: "project6-basemap-opacity-slidebar",
        namespace: LAYOUT_NAMESPACE,
        getComponentType:() => BasemapOpacitySlidebar,
        itemType: "add-opacity",
        title: "Add opacity",
    })

    registry.registerModel({
        getModel:(config) => new BasemapOpacitySlidebarModel(config),
        itemType: "add-opacity"
    })
}
