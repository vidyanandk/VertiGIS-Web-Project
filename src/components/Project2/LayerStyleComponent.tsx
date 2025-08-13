import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Modal from "@vertigis/web/ui/Modal";
import Typography from "@vertigis/web/ui/Typography";

import type LayerListProjectModel from "./LayerListProjectModel";

export default function LayerStyleComponent(props: LayoutElementProperties<LayerListProjectModel>) {
    const { model, ...other } = props;

    useWatchAndRerender(model, [
        "featureServiceLayers",
        "symbolStyle",
        "symbolColor",
        "outlineColor",
        "symbolSize",
        "symbolAngle",
        "xOffset",
        "yOffset",
        "outlineWidth",
        "lineStyle",
        "geo",
        "stylemodel",
        "selectedlayer",
    ]);

    const getRenderer = () => {
        if (model?.geo === "polyline") {
            return {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    style: model.lineStyle,
                    color: model.symbolColor || "#DA1010",
                    width: model.symbolSize,
                    outline: {
                        color: model.outlineColor,
                        width: model.outlineWidth,
                    },
                },
            };
        } else {
            return {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    style: model.symbolStyle,
                    color: model.symbolColor,
                    size: model.symbolSize,
                    angle: model.symbolAngle,
                    xoffset: model.xOffset,
                    yoffset: model.yOffset,
                    outline: {
                        color: model.outlineColor,
                        width: model.outlineWidth,
                    },
                },
            };
        }
    };

    const handleApplyStyle = () => {
        if (!model.layer) {
            console.error("No layer to style.");
            return;
        }

        const newRenderer = getRenderer();
        model.layer.renderer = newRenderer;

        console.log("Applied renderer:", newRenderer);
        model.stylemodel = false;
    };

    return (
        <LayoutElement {...other}>
            <Modal open={model.stylemodel} onClose={() => { model.stylemodel = false; }}>
                <div
                    style={{
                        padding: "1.5rem",
                        maxWidth: "500px",
                        width: "95%",
                        backgroundColor: "#f9fafb",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                        margin: "auto",
                        fontFamily: "Segoe UI, sans-serif",
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h5">{model.layer?.name} - Style</Typography>

                    {model?.geo === "polyline" ? (
                        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                            Line Style:
                            <select value={model.lineStyle} onChange={(e) => { model.lineStyle = e.target.value; }}>
                                <option value="solid">Solid</option>
                                <option value="dash">Dash</option>
                                <option value="dot">Dot</option>
                                <option value="dash-dot">Dash Dot</option>
                                <option value="long-dash">Long Dash</option>
                                <option value="long-dash-dot">Long Dash Dot</option>
                                <option value="short-dash">Short Dash</option>
                                <option value="short-dash-dot">Short Dash Dot</option>
                            </select>
                        </label>
                    ) : (
                        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                            Style:
                            <select value={model.symbolStyle} onChange={(e) => { model.symbolStyle = e.target.value; }}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="cross">Cross</option>
                                <option value="x">X</option>
                                <option value="diamond">Diamond</option>
                                <option value="triangle">Triangle</option>
                            </select>
                        </label>
                    )}

                    <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                        Fill Color:
                        <input type="color" value={model.symbolColor} onChange={(e) => { model.symbolColor = e.target.value; }} />
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                        Outline Color:
                        <input type="color" value={model.outlineColor} onChange={(e) => { model.outlineColor = e.target.value; }} />
                    </label>

                    {model?.geo !== "polyline" && (
                        <>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                                Size:
                                <input
                                    type="number"
                                    min="0"
                                    value={model.symbolSize}
                                    onChange={(e) => { model.symbolSize = Number(e.target.value); }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                                Angle:
                                <input
                                    type="number"
                                    value={model.symbolAngle}
                                    onChange={(e) => { model.symbolAngle = Number(e.target.value); }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                                X Offset:
                                <input
                                    type="number"
                                    value={model.xOffset}
                                    onChange={(e) => { model.xOffset = Number(e.target.value); }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                                Y Offset:
                                <input
                                    type="number"
                                    value={model.yOffset}
                                    onChange={(e) => { model.yOffset = Number(e.target.value); }}
                                />
                            </label>
                        </>
                    )}

                    <label style={{ display: "flex", flexDirection: "column", fontSize: "0.95rem", gap: "0.25rem" }}>
                        Outline Width:
                        <input
                            type="number"
                            min="0"
                            value={model.outlineWidth}
                            onChange={(e) => { model.outlineWidth = Number(e.target.value); }}
                        />
                    </label>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyStyle}
                        style={{ marginTop: "0.5rem" }}
                    >
                        Apply Style
                    </Button>
                    <Button
                        onClick={() => { model.stylemodel = false; }}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
        </LayoutElement>
    );
}
