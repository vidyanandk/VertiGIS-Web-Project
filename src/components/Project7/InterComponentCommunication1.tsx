import { LayoutElement, type LayoutElementProperties } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";

import InterComponentCommunication2 from "./InterComponentCommunication2";
import type InterComponentModel from "./InterComponentModel";

export default function InterComponentCommunication1(
    props: LayoutElementProperties<InterComponentModel>
) {
    const { model, ...other } = props;

    // Watch for state changes
    useWatchAndRerender(model, ["openComponent"]);

    const handleOpenClick = () => {
        model.openComponent = true;
    };

    return (
        <LayoutElement {...other}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenClick}
                style={{ marginBottom: "1rem" }}
            >
                Open Component P7
            </Button>
            <InterComponentCommunication2 model={model} />
        </LayoutElement>
    );
}
