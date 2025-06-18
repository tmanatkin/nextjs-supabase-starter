import VisibleIcon from "@/icons/ui/VisibleIcon";
import "./VisibilityIcon.scss";
import HiddenIcon from "@/icons/ui/HiddenIcon";

type VisibilityIconProps = {
  toggleIcon: boolean;
  onClick: () => void;
};

export default function VisibilityIcon({ toggleIcon, onClick }: VisibilityIconProps) {
  return (
    <button className="auth-card-form-visibility-icon auth-card-form-icon" onClick={onClick} type="button">
      {toggleIcon ? <HiddenIcon /> : <VisibleIcon />}
    </button>
  );
}
