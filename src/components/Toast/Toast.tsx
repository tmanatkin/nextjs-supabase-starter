import { useEffect } from "react";
import "./Toast.scss";
import ErrorIcon from "@/icons/ui/ErrorIcon";
import { Status } from "@/types/Status";

type ToastProps = {
  message: React.ReactNode;
  type: Status;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
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
