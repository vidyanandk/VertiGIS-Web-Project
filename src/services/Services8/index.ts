import type { LibraryRegistry } from "@vertigis/web/config";

import Project8Service from "./Service8";

export default function(registry: LibraryRegistry): void {
    registry.registerService({
        id: "project-8.service",
        getService: () => new Project8Service(),
    });
    registry.registerOperation({
        name: "project-8.alertconfirmNumber",
        serviceId: "project-8.service",
    })
}