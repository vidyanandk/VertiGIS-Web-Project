import type { LibraryRegistry } from "@vertigis/web/config";

import Project5 from "./Project5Service";

export default function(registry: LibraryRegistry) : void {
    registry.registerService({
        id: "project-5.service-in-it",
        getService: () => new Project5(),
    });
    registry.registerCommand({
        name: "command-service.set-the-layer-styling",
        serviceId: "project-5"
    })
}