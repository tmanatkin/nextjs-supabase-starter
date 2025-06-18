import "./ValidityIcon.scss";
import ValidIcon from "../../../../../icons/ui/ValidIcon";
import WarningIcon from "../../../../../icons/ui/WarningIcon";
import ErrorIcon from "../../../../../icons/ui/ErrorIcon";
import NeutralIcon from "../../../../../icons/ui/NeutralIcon";
import { ValidityStatus } from "@/types/ValidityStatus";

type ValidityIconProps = {
  status: ValidityStatus;
  label?: string;
};

export default function ValidityIcon({ status, label }: ValidityIconProps) {
  return (
    <div className="auth-card-form-validity-icon auth-card-form-icon">
      {status === "valid" && <ValidIcon />}
      {status === "warning" && <WarningIcon />}
      {status === "error" && <ErrorIcon />}
      {status === "neutral" && <NeutralIcon />}
      {label && <p className="validity-icon-label">{label}</p>}
    </div>
  );
}
