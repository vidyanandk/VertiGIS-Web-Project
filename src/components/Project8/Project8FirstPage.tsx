import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";

import type Project8Model from "./Project8Model";
import Project8SecondPage from "./Project8SecondPage";

export default function Project8(props: LayoutElementProperties<Project8Model>) {
    const { model, ...other } = props;

    // Reactively re-render when modal state changes
    useWatchAndRerender(model, ["open"]);

    const handleClick = (): void => {
        model.openComponent = true;
    };

    return (
        <LayoutElement {...other} >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                    style={{
                        fontWeight: "bold",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                    }}
                >
                    Click to Open Project8
                </Button>
            </div>

            <Project8SecondPage
                model={model}
                preloadChildren={() => Promise.resolve()}
            />
        </LayoutElement>
    );
}
