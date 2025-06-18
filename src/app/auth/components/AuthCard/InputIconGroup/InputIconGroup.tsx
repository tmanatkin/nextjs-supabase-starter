import { ValidityStatus } from "@/types/ValidityStatus";
import ValidityIcon from "../ValidityIcon/ValidityIcon";
import "./inputIconGroup.scss";

type InputIconGroupProps = {
  label?: string;
  validityStatuses: {
    label: string;
    status: ValidityStatus;
  }[];
  children: React.ReactNode;
};

export default function InputIconGroup({ label, validityStatuses, children }: InputIconGroupProps) {
  const className = label ? label.toLowerCase().replace(/ /g, "-") : "";

  return (
    <div className="auth-card-form-input-icon-group">
      {label && (
        <label className="auth-card-form-label" htmlFor={`"auth-card-form-${className}`}>
          {label}
        </label>
      )}

      {children}

      <div className="auth-card-form-input-icon-group-icons">
        {validityStatuses.map(({ label, status }) => (
          <ValidityIcon key={label} status={status} label={label} />
        ))}
      </div>
    </div>
  );
}
