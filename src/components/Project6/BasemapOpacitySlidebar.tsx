import { LayoutElement, type LayoutElementProperties } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Slider from "@vertigis/web/ui/Slider";

import type BasemapOpacitySidebarModel from "./BasemapOpacitySlidebarModel";

const BasemapOpacitySlidebar = (props: LayoutElementProperties<BasemapOpacitySidebarModel>) => {
    const { model } = props;

    // Rerender the component when opacity changes
    useWatchAndRerender(model, "opacity");

    return (
        <LayoutElement
            {...props}
            style={{
                margin: "1rem",
                padding: "1rem",
                borderRadius: "10px",
                backgroundColor: "#20b5c0ff",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                width: "fit-content",
                height: "fit-content",
            }}
        >
            <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#333"  }}>Basemap Opacity P6</span>
                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={model.opacity}
                    onChange={(e, value: number) => {
                        // eslint-disable-next-line no-void
                        void model.handleOpacityChange(value);
                    }}
                />
            </div>
        </LayoutElement>
    );
};


export default BasemapOpacitySlidebar;
