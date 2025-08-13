import Color from "@arcgis/core/Color";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import * as messaging from "@vertigis/web/messaging";
import { importModel } from "@vertigis/web/models";
import {
    ComponentModelBase,
    serializable,
    type ComponentModelProperties,
} from "@vertigis/web/models";

export interface StyleEditorToolModelProperties extends ComponentModelProperties {
    activeLayerId?: string;
    visible?: boolean;
    symbolColor?: string;
    symbolSize?: number;
}

@serializable
export default class StyleEditorToolModel extends ComponentModelBase<StyleEditorToolModelProperties> {
    activeLayerId: string | undefined;
    visible = true;
    symbolColor = "#ff0000";
    symbolSize = 10;

    @importModel("map-extension")
    mapExtension: MapExtension;

    get layers() {
        return this.mapExtension?.map?.layers?.toArray?.() ?? [];
    }

    get activeLayer(): FeatureLayer | undefined {
        if (!this.activeLayerId) return undefined;
        return this.mapExtension?.map?.findLayerById(this.activeLayerId) as FeatureLayer;
    }

    setActiveLayer(id: string) {
        this.activeLayerId = id;
        const layer = this.activeLayer;
        if (layer) {
            this.visible = layer.visible;
            const r: any = layer.renderer;
            if (r?.type === "simple" && r.symbol) {
                if (r.symbol.color) {
                    this.symbolColor = Color.fromJSON(r.symbol.color).toHex();
                }
                if (r.symbol.size) {
                    this.symbolSize = Number(r.symbol.size);
                }
            }
        }
    }

    toggleVisibility(next: boolean) {
        const layer = this.activeLayer;
        if (!layer) return;
        layer.visible = next;
        this.visible = next;
    }

    applySimpleRenderer() {
        const layer = this.activeLayer;
        if (!layer) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const symbol = new SimpleMarkerSymbol({
            color: Color.fromHex(this.symbolColor),
            size: this.symbolSize,
            outline: { width: 0.5, color: Color.fromHex("#333") },
        } as any);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        layer.renderer = new SimpleRenderer({ symbol } as any);
    }

    enableLabels(attrField: string) {
        const layer = this.activeLayer;
        if (!layer) return;
        const lc = new LabelClass({
            labelExpressionInfo: { expression: `$feature.${attrField}` },
            symbol: {
                type: "text",
                color: Color.fromHex("#222"),
                haloColor: Color.fromHex("#fff"),
                haloSize: "1px",
                font: { size: 12 },
            },
        });
        layer.labelingInfo = [lc];
        layer.labelsVisible = true;
    }

    @messaging.command("style-editor.showNotification")
    async showNotification(message: string) {
        await this.messages.commands.ui.displayNotification.execute({
            title: "Style Editor Tool",
            message,
        });
    }
}
