import type { LibraryRegistry } from "@vertigis/web/config";

import StyleEditorTool from "./StyleEditorTool";
import StyleEditorToolModel from "./StyleEditorToolModel";


export default function (registry: LibraryRegistry, LAYOUT_NAMESPACE: string) {
    // ... other item registrations

    registry.registerComponent({
        name: "style-editor-tool-P5",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => StyleEditorTool as React.ComponentType<any>,
        itemType: "style-editor-tool-model",
        title: "Style Editor Tool",
    });
    registry.registerModel({
        getModel: (config) => new StyleEditorToolModel(config),
        itemType: "style-editor-tool-model",
    });
}