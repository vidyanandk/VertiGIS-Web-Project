export const NotificationStyle = {
  background: "lightblue",
  color: "darkblue",
  border: "1px solid darkblue",
  borderRadius: "5px",
  padding: "10px",
  margin: "10px 0",
  position: "absolute",
  zIndex: 1000
};

export enum NotificationCategory {
    ERROR = "error",
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
  }
  
  export enum Position {
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
  }