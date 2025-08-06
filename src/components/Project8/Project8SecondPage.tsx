import type { LayoutElementProperties } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Button from "@vertigis/web/ui/Button";
import Modal from "@vertigis/web/ui/Modal";

import type Project8Model from "./Project8Model";

export default function Project8Opening(props: LayoutElementProperties<Project8Model>) {
    const { model } = props;

    useWatchAndRerender(model, ["input", "openComponent"]);

    const handleSubmit = () => {
        // eslint-disable-next-line no-void
        void model.triggerConfirmationAlert(model.input);
        model.input = 0;
        model.openComponent = false;
    };

    const handleClose = () => {
        model.openComponent = false;
    };

    const handleReset = () => {
        model.input = 0;
    };

    return (
        <Modal open={model.openComponent} onClose={handleClose}>
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "400px",
                    margin: "5vh auto",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.5rem",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        color: "#222",
                        textAlign: "center",
                    }}
                >
                    Enter a Number
                </h2>

                <input
                    type="number"
                    placeholder="e.g. 42"
                    value={model.input}
                    onChange={(e) => (model.input = Number(e.target.value))}
                    style={{
                        width: "100%",
                        maxWidth: "200px",
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        textAlign: "center",
                        outline: "none",
                        transition: "border-color 0.2s",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        width: "100%",
                    }}
                >
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="outlined" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
