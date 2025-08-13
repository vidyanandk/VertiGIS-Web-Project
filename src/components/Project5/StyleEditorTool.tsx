// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// import Color from "@arcgis/core/Color";
// import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
// import LabelClass from "@arcgis/core/layers/support/LabelClass";
// import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
// import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
// import { useEffect, useState } from "react";

// type LayerLike = FeatureLayer | __esri.Layer;

// export default function StyleEditorTool({
//   map,
// }: {
//   mapView: __esri.MapView;
//   map: __esri.Map | undefined;
// }) {
//   const [layers, setLayers] = useState<LayerLike[]>([]);
//   const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
//   const [layerObj, setLayerObj] = useState<LayerLike | null>(null);

//   // form state for simple renderer
//   const [visible, setVisible] = useState(true);
//   const [symbolColor, setSymbolColor] = useState("#ff0000");
//   const [symbolSize, setSymbolSize] = useState(10);

//   // Populate layers when map changes and is defined
//   useEffect(() => {
//     if (!map) return;
//     const arr = map.layers.toArray();
//     setLayers(arr);
//   }, [map]);

//   // Update active layer and sync UI state from it
//   useEffect(() => {
//     if (!map || !activeLayerId) {
//       setLayerObj(null);
//       return;
//     }
//     const l = map.findLayerById(activeLayerId) as LayerLike;
//     if (!l) {
//       setLayerObj(null);
//       return;
//     }
//     setLayerObj(l);

//     setVisible(Boolean(l.visible));

//     // Try to extract symbol color and size from renderer if simple
//     const r: any = (l as FeatureLayer).renderer;
//     if (r?.type === "simple" && r.symbol) {
//       if (r.symbol.color) {
//         const c = r.symbol.color;
//         setSymbolColor(
//           Array.isArray(c) ? `rgb(${c.join(",")})` : Color.fromJSON(c).toHex()
//         );
//       }
//       if (r.symbol.size) setSymbolSize(Number(r.symbol.size));
//     }
//   }, [activeLayerId, map]);

//   // Toggle visibility
//   function toggleVisibility(next: boolean) {
//     if (!layerObj) return;
//     layerObj.visible = next;
//     setVisible(next);
//   }

//   // Apply a simple renderer (live)
//   function applySimpleRenderer() {
//     if (!layerObj) return;

//     const symbol = new SimpleMarkerSymbol({
//       color: Color.fromHex(symbolColor),
//       size: symbolSize,
//       outline: { width: 0.5, color: Color.fromHex("#333") },
//     } as any);

//     const renderer = new SimpleRenderer({ symbol } as any);
//     try {
//       (layerObj as FeatureLayer).renderer = renderer as any;
//     } catch (err) {
//       console.error("Failed to set renderer:", err);
//     }
//   }

//   // Enable basic labels
//   function enableLabels(attrField: string) {
//     if (!layerObj) return;
//     const lc = new LabelClass({
//       labelExpressionInfo: { expression: `$feature.${attrField}` },
//       symbol: {
//         type: "text",
//         color: Color.fromHex("#222"),
//         haloColor: Color.fromHex("#fff"),
//         haloSize: "1px",
//         font: { size: 12 },
//       },
//     });
//     (layerObj as FeatureLayer).labelingInfo = [lc];
//     (layerObj as FeatureLayer).labelsVisible = true;
//   }

//   if (!map) {
//     return <div>Map is not ready yet…</div>;
//   }

//   return (
//     <div style={{ width: 360, padding: 12 }}>
//       <h3>Style Editor</h3>

//       {/* Layer Selection */}
//       <label>Layer</label>
//       <select
//         value={activeLayerId ?? ""}
//         onChange={(e) => setActiveLayerId(e.target.value)}
//       >
//         <option value="">— select layer —</option>
//         {layers.map((l) => (
//           <option key={l.id} value={l.id}>
//             {l.title ?? l.id}
//           </option>
//         ))}
//       </select>

//       {/* Visibility */}
//       <div style={{ marginTop: 12 }}>
//         <label>
//           <input
//             type="checkbox"
//             checked={visible}
//             onChange={(e) => toggleVisibility(e.target.checked)}
//           />{" "}
//           Visible
//         </label>
//       </div>

//       <hr />

//       {/* Simple Renderer */}
//       <div>
//         <h4>Simple Renderer</h4>
//         <label>
//           Color{" "}
//           <input
//             type="color"
//             value={symbolColor}
//             onChange={(e) => setSymbolColor(e.target.value)}
//           />
//         </label>
//         <label>
//           Size{" "}
//           <input
//             type="number"
//             min={2}
//             max={200}
//             value={symbolSize}
//             onChange={(e) => setSymbolSize(Number(e.target.value))}
//           />
//         </label>
//         <button onClick={applySimpleRenderer}>Apply</button>
//       </div>

//       <hr />

//       {/* Labels */}
//       <div>
//         <h4>Labels</h4>
//         <label>
//           Attribute{" "}
//           <input type="text" placeholder="FIELDNAME" id="labelField" />
//         </label>
//         <button
//           onClick={() =>
//             enableLabels(
//               (document.getElementById("labelField") as HTMLInputElement).value
//             )
//           }
//         >
//           Enable Labels
//         </button>
//       </div>
//     </div>
//   );
// }




import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import Button from "@vertigis/web/ui/Button";
import { toast } from "react-toastify";

import type StyleEditorToolModel from "./StyleEditorToolModel";

export default function StyleEditorTool(
    props: LayoutElementProperties<StyleEditorToolModel>
) {
    const { model } = props;

    const handleVisibilityToggle = () => {
        if (!model.activeLayer) {
            toast.error("No active layer selected");
            return;
        }
        const nextVisibility = !model.visible;
        model.toggleVisibility(nextVisibility);
        toast(
            `Layer "${model.activeLayer.title}" is now ${
                nextVisibility ? "visible" : "hidden"
            }.`,
            { position: "top-right", autoClose: 2000 }
        );
    };

    const handleApplyStyle = () => {
        if (!model.activeLayer) {
            toast.error("No active layer selected");
            return;
        }
        model.applySimpleRenderer();
        toast.success("Renderer style updated", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const handleEnableLabels = () => {
        if (!model.activeLayer) {
            toast.error("No active layer selected");
            return;
        }
        // eslint-disable-next-line no-alert
        const fieldName = prompt("Enter the field name for labels:");
        if (fieldName) {
            model.enableLabels(fieldName);
            toast.success(`Labels enabled for "${fieldName}"`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <LayoutElement {...props}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Select Layer */}
                <select
                    value={model.activeLayerId ?? ""}
                    onChange={(e) => model.setActiveLayer(e.target.value)}
                >
                    <option value="">— Select Layer —</option>
                    {model.layers.map((layer) => (
                        <option key={layer.id} value={layer.id}>
                            {layer.title ?? layer.id}
                        </option>
                    ))}
                </select>

                {/* Toggle Visibility */}
                <Button onClick={handleVisibilityToggle}>
                    {model.visible ? "Hide Layer" : "Show Layer"}
                </Button>

                {/* Apply Renderer Style */}
                <Button onClick={handleApplyStyle}>Apply Renderer</Button>

                {/* Enable Labels */}
                <Button onClick={handleEnableLabels}>Enable Labels</Button>
            </div>
        </LayoutElement>
    );
}
