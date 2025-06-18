import { useEffect } from "react";
import "./Toast.scss";
import ErrorIcon from "@/icons/ui/ErrorIcon";

type ToastProps = {
  message: string;
  type?: "error" | "success" | "warning";
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type = "error", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          <ErrorIcon />
        </button>
      </div>
    </div>
  );
}
