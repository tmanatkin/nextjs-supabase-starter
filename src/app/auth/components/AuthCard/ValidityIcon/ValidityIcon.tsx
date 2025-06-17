import "./ValidityIcon.scss";

type ValidityIconProps = {
  status: "valid" | "warning" | "error" | "neutral";
  label?: string;
  nextToInput?: boolean;
};

export default function ValidityIcon({ status, label, nextToInput }: ValidityIconProps) {
  return (
    <div className={`auth-card-form-validity-icon ${nextToInput ? "auth-card-form-validity-icon-next-to-input" : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`feather feather-circle feather-x-circle feather-check-circle feather-alert-circle auth-card-form-validity-icon-svg auth-card-form-validity-icon-svg-${status}`}
      >
        {status === "valid" && (
          <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </>
        )}
        {status === "warning" && (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </>
        )}
        {status === "error" && (
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </>
        )}
        {status === "neutral" && <circle cx="12" cy="12" r="10"></circle>}
      </svg>
      {label && <p className="validity-icon-label">{label}</p>}
    </div>
  );
}
