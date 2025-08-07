import {type LibraryRegistry } from "@vertigis/web/config";
 
import Project10Service from "./Project10Service";
 
export default function (registry: LibraryRegistry) {
    registry.registerService({
        id: "Project10Service-Id",
        getService: () => new Project10Service(),
    });
   
 registry.registerOperation({
     name: "map.click.get-nearby-features",
     serviceId: "Project10Service-Id",
     });
//  registry.registerOperation({
//      name: "map.click.show-feature-popup",
//      serviceId: "Project10Service-Id",
//      });
// registry.registerOperation({
//      name: "map.click.handle-click",
//      serviceId: "Project10Service-Id",
//      });
}