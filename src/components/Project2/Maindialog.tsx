import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Modal from "@vertigis/web/ui/Modal";
import Typography from "@vertigis/web/ui/Typography";

import type LayerListProjectModel from "./LayerListProjectModel";

export default function MainDialog(props: LayoutElementProperties<LayerListProjectModel>) {
    const { model, ...other } = props;

    useWatchAndRerender(model, [
        "maindialogmodel",
        "propertiesModel",
        "stylemodel",
        "selectedLayer",
    ]);

    const openPropertiesDialog = () => {
        model.maindialogmodel = false;
        model.propertiesModel = true;
    };
    const closeMainDialog = () => {
        model.maindialogmodel = false;
    };
    const openStyleDialog = () => {
        model.maindialogmodel = false;
        model.stylemodel = true;
    };

    return (
        <LayoutElement {...other}>
            <Modal
                open={model.maindialogmodel}
                onClose={() => {
                    model.maindialogmodel = false;
                }}
            >
                {/* <div
                    style={{
                        padding: "2rem",
                        width: "300px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                > */}
                <div
                    style={{
                        padding: "1.5rem",
                        width: "90%",
                        maxWidth: "360px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                        fontFamily: "Segoe UI, sans-serif",
                        margin: "auto",
                    }}
                >
                    <Typography variant="h6" style={{ marginBottom: "1rem" }}>
                        {model.selectedLayer?.name}
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <Button onClick={openPropertiesDialog} variant="contained">
                            Properties
                        </Button>
                        <Button onClick={openStyleDialog} variant="contained">
                            Style
                        </Button>
                        <Button onClick={closeMainDialog} variant="outlined" color="primary">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </LayoutElement>
    );
}
