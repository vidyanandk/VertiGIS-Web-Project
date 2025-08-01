import { type LibraryRegistry } from "@vertigis/web/config";

import Project1Service from "./Project1Service";

export default function(registry:LibraryRegistry):void{
     registry.registerService({
        id: "toast-service",
        getService: () => new Project1Service(),
     });
     registry.registerCommand({
        name: "project1.confirm-me",
        serviceId: "toast-service",
    });
}
