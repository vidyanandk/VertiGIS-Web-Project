// // import {
// //     LayoutElement,
// //     LayoutElementProperties,
// // } from "@vertigis/web/components";
// // import Button from "@vertigis/web/ui/Button";

// // import LayerListProjectModel from "./LayerListProjectModel";

// // const LayerListProject = (
// //     props: LayoutElementProperties<LayerListProjectModel>
// // ) => {
// //     const { model } = props;

// //     return (
// //         <LayoutElement {...props}>
// //            <Button onClick={() => console.log("Button clicked!")}>Click Me</Button>
// //         </LayoutElement>
// //     );
// // };

// // export default LayerListProject;





// import { LayoutElement, type LayoutElementProperties } from "@vertigis/web/components";
// import { useWatchAndRerender, UIContext } from "@vertigis/web/ui";
// import Button from "@vertigis/web/ui/Button";
// import Checkbox from "@vertigis/web/ui/Checkbox";
// import DynamicIcon from "@vertigis/web/ui/DynamicIcon";
// import Typography from "@vertigis/web/ui/Typography";
// import { useState, useContext } from "react";

// import type LayerListProjectModel from "./LayerListProjectModel";
// import LayerStyleComponent from "./LayerStyleComponent";
// import MainDialog from "./Maindialog";
// import Properties from "./Properties";

// export default function LayerListComponent(props: LayoutElementProperties<LayerListProjectModel>) {
//     const { model, ...other } = props;
//     const { translate } = useContext(UIContext);
//     const [checkedLayers, setCheckedLayers] = useState<Record<number, boolean>>({});
    

//     useWatchAndRerender(model, [
//         "featureServiceLayers",
//         "symbolStyle",
//         "symbolColor",
//         "outlineColor",
//         "symbolSize",
//         "symbolAngle",
//         "xoffset",
//         "yoffset",
//         "outlineWidth",
//         "lineStyle",
//         "geo",
//         "maindialogmodel",
//     ]);

//     const handleFetchLayers = async () => {
//         await model.fetchLayersFromFeatureService();
//         if (model.featureServiceLayers.length > 0) {
//             const initialChecked: Record<number, boolean> = {};
//             model.featureServiceLayers.forEach(layer => {
//                 initialChecked[layer.id] = false;
//             });
//             setCheckedLayers(initialChecked);
//         }
//     };

//     const handleCheckboxChange = (layerId: number, checked: boolean) => {
//         setCheckedLayers(prev => ({ ...prev, [layerId]: checked }));
//         const map = model.mapExtension?.map;
//         if (!map) return;
//         if (checked) {
//             // eslint-disable-next-line no-void
//             void model.addLayerToMap([model.featureServiceLayers.find(layer => layer.id === layerId)]);
//         } else {
//             // eslint-disable-next-line no-void
//             void model.removeLayerFromMap(layerId);
//         }
//     };

//     const openMainDialog = (layer: typeof model.featureServiceLayers[number]) => {
//         // setSelectedLayer(layer);
//         model.selectedLayer = layer;
//         model.maindialogmodel = true;
        
//     };



//     return (
//         <LayoutElement {...other} style={{ padding: "1rem" }}>
//             <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
//                 <Button variant="contained" color="primary" onClick={handleFetchLayers}>
//                     {translate("Fetch Layer")}
//                 </Button>
//             </div>

//             <div
//                 style={{
//                     maxHeight: "400px",
//                     overflowY: "auto",
//                     paddingRight: "8px",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "0.75rem",
//                 }}
//             >
//                 {model.featureServiceLayers.length > 0 ? (
//                     model.featureServiceLayers.map(layer => (
//                         <div
//                             key={layer.id}
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 padding: "0.75rem 1rem",
//                                 borderRadius: "8px",
//                                 backgroundColor: "#f9f9f9",
//                                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//                                 <Checkbox
//                                     size="medium"
//                                     checked={checkedLayers[layer.id] || false}
//                                     onChange={e => handleCheckboxChange(layer.id, e.target.checked)}
//                                 />
//                                 <Typography variant="body1" style={{ fontWeight: 500 }}>
//                                     {layer.name}
//                                 </Typography>
//                             </div>
//                             <DynamicIcon
//                                 src="action-menu"
//                                 style={{ width: "24px", height: "24px" }}
//                                 onClick={() => openMainDialog(layer)}
//                             />
//                         </div>
//                     ))
//                 ) : (
//                     <Typography variant="body2" style={{ textAlign: "center", color: "#888" }}>
//                         {translate("No layers fetched yet.")}
//                     </Typography>
//                 )}
//             </div>

            
//              <MainDialog model={model} preloadChildren={function (): Promise<void> {
//                 throw new Error("Function not implemented.");
//             } }/>
        
//             <Properties model={model} preloadChildren={function (): Promise<void> {
//                 throw new Error("Function not implemented.");
//             } } />

           
           
//             <LayerStyleComponent
//                 model={model}
//                 preloadChildren={() => Promise.resolve()}
//             />
//         </LayoutElement>
//     );
// }



import { LayoutElement, type LayoutElementProperties } from "@vertigis/web/components";
import { useWatchAndRerender, UIContext } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Checkbox from "@vertigis/web/ui/Checkbox";
import DynamicIcon from "@vertigis/web/ui/DynamicIcon";
import Typography from "@vertigis/web/ui/Typography";
import { useState, useContext } from "react";

import type LayerListProjectModel from "./LayerListProjectModel";
import LayerStyleComponent from "./LayerStyleComponent";
import MainDialog from "./Maindialog";
import Properties from "./Properties";

export default function LayerListComponent(props: LayoutElementProperties<LayerListProjectModel>) {
    const { model, ...other } = props;
    const { translate } = useContext(UIContext);
    const [checkedLayers, setCheckedLayers] = useState<Record<number, boolean>>({});

    useWatchAndRerender(model, [
        "featureServiceLayers",
        "symbolStyle",
        "symbolColor",
        "outlineColor",
        "symbolSize",
        "symbolAngle",
        "xoffset",
        "yoffset",
        "outlineWidth",
        "lineStyle",
        "geo",
        "maindialogmodel",
    ]);

    const handleFetchLayers = async () => {
        await model.fetchLayersFromFeatureService();
        if (model.featureServiceLayers.length > 0) {
            const initialChecked: Record<number, boolean> = {};
            model.featureServiceLayers.forEach(layer => {
                initialChecked[layer.id] = false;
            });
            setCheckedLayers(initialChecked);
        }
    };

    const handleCheckboxChange = (layerId: number, checked: boolean) => {
        setCheckedLayers(prev => ({ ...prev, [layerId]: checked }));
        const map = model.mapExtension?.map;
        if (!map) return;
        if (checked) {
            // eslint-disable-next-line no-void
            void model.addLayerToMap([model.featureServiceLayers.find(layer => layer.id === layerId)]);
        } else {
            // eslint-disable-next-line no-void
            void model.removeLayerFromMap(layerId);
        }
    };

    const openMainDialog = (layer: typeof model.featureServiceLayers[number]) => {
        model.selectedLayer = layer;
        model.maindialogmodel = true;
    };

    return (
        <LayoutElement {...other} style={{ padding: "1.25rem", fontFamily: "Segoe UI, sans-serif" }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2rem"
            }}>
                <Button variant="contained" color="primary" onClick={handleFetchLayers}>
                    {translate("Fetch all Layers")}
                </Button>
            </div>

            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    paddingRight: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                }}
            >
                {model.featureServiceLayers.length > 0 ? (
                    model.featureServiceLayers.map(layer => (
                        <div
                            key={layer.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.75rem 1rem",
                                borderRadius: "10px",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                transition: "box-shadow 0.2s ease, background-color 0.2s ease",
                                cursor: "pointer",
                            }}
                            // eslint-disable-next-line no-return-assign
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                            // eslint-disable-next-line no-return-assign
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <Checkbox
                                    size="medium"
                                    checked={checkedLayers[layer.id] || false}
                                    onChange={e => handleCheckboxChange(layer.id, e.target.checked)}
                                />
                                <Typography variant="body1" style={{ fontWeight: 500 }}>
                                    {layer.name}
                                </Typography>
                            </div>
                            <DynamicIcon
                                src="action-menu"
                                style={{ width: "24px", height: "24px", cursor: "pointer" }}
                                onClick={() => openMainDialog(layer)}
                            />
                        </div>
                    ))
                ) : (
                    <Typography variant="body2" style={{ textAlign: "center", color: "#888" }}>
                        {translate("No layers fetched yet.")}
                    </Typography>
                )}
            </div>

            <MainDialog
                model={model}
                preloadChildren={function (): Promise<void> {
                    throw new Error("Function not implemented.");
                }}
            />

            <Properties
                model={model}
                preloadChildren={function (): Promise<void> {
                    throw new Error("Function not implemented.");
                }}
            />

            <LayerStyleComponent
                model={model}
                preloadChildren={() => Promise.resolve()}
            />
        </LayoutElement>
    );
}
