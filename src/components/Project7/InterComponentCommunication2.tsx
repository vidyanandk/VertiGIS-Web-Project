import Button from "@vertigis/web/ui/Button";
import Modal from "@vertigis/web/ui/Modal";
import { toast } from "react-toastify";

export default function Project7Opening({ model }: { model: any }) {
    const closeModal = () => {
        model.openComponent = false;
    };

    const handleOpenNotification = () => {
        console.log("Button clicked!");
        toast.success("Welcome to new Page Project 7! 🚀", {
            onClose: closeModal
        });
    };

    return (
        <Modal open={model.openComponent} onClose={closeModal}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                    width: "400px",
                    padding: "2rem",
                    background: "linear-gradient(to bottom right, #ffffff, #f0f4f8)",
                    borderRadius: "20px",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                    margin: "auto",
                    gap: "1.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    border: "1px solid #ddd",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        color: "#2c3e50",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    🚀 Welcome to Project 7
                </h2>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenNotification}
                    style={{
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        borderRadius: "8px",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        transition: "background-color 0.3s ease",
                    }}
                >
                    Open Notification
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={closeModal}
                    style={{
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        borderRadius: "8px",
                        borderColor: "#888",
                        color: "#444",
                        backgroundColor: "#fff",
                        transition: "all 0.3s ease",
                    }}
                >
                    Close This Component
                </Button>
            </div>
        </Modal>
    );
}
