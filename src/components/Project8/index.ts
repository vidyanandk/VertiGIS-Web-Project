import type { LibraryRegistry } from "@vertigis/web/config";

import Project8FirstPage from "./Project8FirstPage";
import Project8Model from "./Project8Model";


export default function (registry: LibraryRegistry, LAYOUT_NAMESPACE: string) {
    // ... other item registrations

    registry.registerComponent({
        name: "project-8-project",
        getComponentType: () => Project8FirstPage,
        itemType: "project-8-model",
        title: "Project 8 First Page",
        namespace: LAYOUT_NAMESPACE
    });
    registry.registerModel({
        getModel: (config) => new Project8Model(config),
        itemType: "project-8-model",
    });
}