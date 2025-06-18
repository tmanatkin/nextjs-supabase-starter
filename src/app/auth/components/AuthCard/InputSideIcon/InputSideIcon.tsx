import { ValidityStatus } from "@/types/ValidityStatus";
import ValidityIcon from "../ValidityIcon/ValidityIcon";
import "./inputSideIcon.scss";
import VisibilityIcon from "../VisibilityIcon/VisibilityIcon";

type BaseProps = {
  label?: string;
  hideIcon?: boolean;
  children: React.ReactNode;
};

type InputSideIconProps =
  | (BaseProps & {
      mode: "validityCheck";
      status: ValidityStatus;
    })
  | (BaseProps & {
      mode: "visibilityToggle";
      toggleIcon: boolean;
      onToggle: () => void;
    });

export default function InputSideIcon(props: InputSideIconProps) {
  const { label, hideIcon = false, children, mode } = props;
  const className = label ? label.toLowerCase().replace(/ /g, "-") : "";

  return (
    <div className="auth-card-form-input-side-icon">
      {label && (
        <label className="auth-card-form-label" htmlFor={`auth-card-form-${className}`}>
          {label}
        </label>
      )}

      <div className="auth-card-form-input-side-icon-container">
        {children}
        {!hideIcon &&
          (mode === "validityCheck" ? (
            <ValidityIcon status={props.status} />
          ) : (
            <VisibilityIcon toggleIcon={props.toggleIcon} onClick={props.onToggle} />
          ))}
      </div>
    </div>
  );
}
