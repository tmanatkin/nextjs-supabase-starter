import "./ValidityIcon.scss";
import SuccessIcon from "../../../../../icons/ui/SuccessIcon";
import WarningIcon from "../../../../../icons/ui/WarningIcon";
import ErrorIcon from "../../../../../icons/ui/ErrorIcon";
import NeutralIcon from "../../../../../icons/ui/NeutralIcon";
import { Status } from "@/types/Status";

type ValidityIconProps = {
  status: Status;
  label?: string;
};

export default function ValidityIcon({ status, label }: ValidityIconProps) {
  return (
    <div className="auth-card-form-validity-icon auth-card-form-icon">
      {status === "success" && <SuccessIcon />}
      {status === "warning" && <WarningIcon />}
      {status === "error" && <ErrorIcon />}
      {status === "neutral" && <NeutralIcon />}
      {label && <p className="validity-icon-label">{label}</p>}
    </div>
  );
}
