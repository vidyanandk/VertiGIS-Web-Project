import type { LibraryRegistry } from "@vertigis/web/config";

import PointsOfInterest, { PointsOfInterestModel } from "./components/PointsOfInterest";
import Project1Service from "./components/Pro1";
import LayerListProject from "./components/Project2";
import GeometryAlertPro4 from "./components/Project4";

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
}
