import { LayoutElement, type LayoutElementProperties } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Modal from "@vertigis/web/ui/Modal";
import Typography from "@vertigis/web/ui/Typography";

import type LayerListProjectModel from "./LayerListProjectModel";


export default function Properties(props: LayoutElementProperties<LayerListProjectModel>) {
    const { model,...other } = props;
    useWatchAndRerender(model, ["propertiesModel", "selectedLayer", "geo"]);

    return (
        <LayoutElement {...other}>
            <Modal open={model.propertiesModel} onClose={()=> {model.propertiesModel = false;}}>
                <div
                    style={{
                        padding: "2rem",
                        width: "400px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {model.selectedLayer ? (
                        <>
                            <Typography variant="h5">{model.selectedLayer.name} - Properties</Typography>
                            <Typography variant="body2" style={{ margin: "1rem 0" }}>
                                <strong>ID:</strong> {model.selectedLayer.id}
                                <br />
                                <strong>Parent Layer ID:</strong> {model.selectedLayer.parentLayerId}
                                <br />
                                <strong>Default Visibility:</strong> {model.selectedLayer.defaultVisibility ? "Yes" : "No"}
                                <br />
                                <strong>Sub Layer IDs:</strong> {model.selectedLayer.subLayerIds || "None"}
                                <br />
                                <strong>Min Scale:</strong> {model.selectedLayer.minScale}
                                <br />
                                <strong>Max Scale:</strong> {model.selectedLayer.maxScale}
                                <br />
                                <strong>Type:</strong> {model.selectedLayer.type}
                                <br />
                                <strong>Geometry Type:</strong> {model.geo}
                                <br />
                            </Typography>
                            <Button onClick={() => {model.propertiesModel = false;
                                model.selectedLayer = null;
                            }} variant="outlined" color="primary">
                                Close
                            </Button>
                        </>
                    ) : (
                        <Typography>No layer selected.</Typography>
                    )}
                </div>
            </Modal>
        </LayoutElement>
    );
}
