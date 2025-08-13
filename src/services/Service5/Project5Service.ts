import { command } from "@vertigis/web/messaging";
import { inject, ServiceBase } from "@vertigis/web/services";

import type MapDefinitionDataService from "../MapDefinitionDataService/MapDefinitionDataService";

interface LayerSymbol {
    color: string;
    size?: number;
    xoffset?: number;
    yoffset?: number;
    angle?: number;
    outline?: {
        width: number;
        color: string;
    };
    style: string;
    width?: number;
}

interface SetLayerStyleArgs {
    layers: {
        layer: {
            id: string;
            geometryType: "point" | "polyline" | "polygon";
        };
    };
    symbol: LayerSymbol;
}

export default class Project5 extends ServiceBase {
    @inject("map-definition-data-service")
    MapDefinitionDataService: MapDefinitionDataService | undefined;

    @command("command-service.set-the-layer-styling")
    protected setLayerStyle(args: SetLayerStyleArgs): void {
        const mapDefinition = this.MapDefinitionDataService?.mapDefinition as any;

        if (!mapDefinition?.userSettings?.layerStyles) {
            mapDefinition.userSettings.layerStyles = {};
        }

        const { id, geometryType } = args.layers.layer;
        const symbol = args.symbol;

        const style: any = {
            type: geometryType,
            symbol: {
                color: symbol.color,
                style: symbol.style,
            },
        };

        if (geometryType === "point") {
            Object.assign(style.symbol, {
                size: symbol.size,
                xoffset: symbol.xoffset,
                yoffset: symbol.yoffset,
                angle: symbol.angle,
                outline: {
                    width: symbol.outline?.width,
                    color: symbol.outline?.color,
                },
            });
        } else if (geometryType === "polyline") {
            Object.assign(style.symbol, {
                width: symbol.width,
            });
        }

        mapDefinition.userSettings.layerStyles[id] = style;
    }
}
