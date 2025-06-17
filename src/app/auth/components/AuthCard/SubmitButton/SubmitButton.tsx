import "./submitButton.scss";

type SubmitButtonProps = {
  label: string;
};

export default function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button className="auth-card-form-submit" type="submit">
      {label}
    </button>
  );
}
