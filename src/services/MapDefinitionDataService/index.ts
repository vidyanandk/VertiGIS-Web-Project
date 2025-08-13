import type { LibraryRegistry } from "@vertigis/web/config";

import MapDefinitionDataService from "./MapDefinitionDataService";

export default function(registry: LibraryRegistry) : void {
    registry.registerService({
        id: "map-definition-data-service",
        getService: (config) => new MapDefinitionDataService(config),
    });
}