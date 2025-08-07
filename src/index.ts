import type { LibraryRegistry } from "@vertigis/web/config";

import PointsOfInterest, { PointsOfInterestModel } from "./components/PointsOfInterest";
import Project1Service from "./components/Pro1";
import Project9CM from "./components/Proj9";
import Project10 from "./components/Project10";
import LayerListProject from "./components/Project2";
import GeometryAlertPro4 from "./components/Project4";
import BasemapOpacitySlidebar from "./components/Project6";  
import InterComponentCommunication from "./components/Project7";
import Project8 from "./components/Project8";
import Project10Service from "./services/Service10";
import Project7Service from "./services/Services8";
// import Project9 from "./components/Project9";


const LAYOUT_NAMESPACE = "custom.d4bfff9a";

export default function (registry: LibraryRegistry): void {
    registry.registerComponent({
        // Show in the `map` category of the component toolbox.
        category: "map",
        iconId: "station-locator",
        name: "points-of-interest",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => PointsOfInterest,
        itemType: "points-of-interest-model",
        title: "Points of Interest",
    });
    registry.registerModel({
        getModel: config => new PointsOfInterestModel(config),
        itemType: "points-of-interest-model",
    });
    registry.registerCommand({
        name: "points-of-interest.create",
        itemType: "points-of-interest-model",
    });

    Project1Service(registry);
   
    LayerListProject(registry, LAYOUT_NAMESPACE);
    GeometryAlertPro4(registry, LAYOUT_NAMESPACE);
    BasemapOpacitySlidebar(registry, LAYOUT_NAMESPACE);
    InterComponentCommunication(registry, LAYOUT_NAMESPACE);
    Project8(registry, LAYOUT_NAMESPACE);
    Project7Service(registry);
    // Project9(registry, LAYOUT_NAMESPACE);
    Project9CM(registry, LAYOUT_NAMESPACE);
    Project10Service(registry);
    Project10(registry, LAYOUT_NAMESPACE);
}
