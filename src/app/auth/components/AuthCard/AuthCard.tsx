"use client";

import "./authCard.scss";
import { ValidityStatus } from "@/types/ValidityStatus";
import { useState, useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { supabase } from "../../../../lib/supabaseClient";
import SubmitButton from "./SubmitButton/SubmitButton";
import Toast from "../../../../components/Toast/Toast";
import InputSideIcon from "./InputSideIcon/InputSideIcon";
import InputIconGroup from "./InputIconGroup/InputIconGroup";

type AuthCardProps = {
  type: "login" | "signup";
};

export default function AuthCard({ type }: AuthCardProps) {
  const authButtonLabel = type === "login" ? "Log In" : "Sign Up";
  const authTitle = type === "login" ? "Welcome Back" : "Get Started";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const debouncedEmail = useDebounce(email, 300);
  const debouncedPassword = useDebounce(password, 300);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [emailValidity, setEmailValidity] = useState<ValidityStatus>("neutral");
  const [passwordUpper, setPasswordUpper] = useState<ValidityStatus>("neutral");
  const [passwordNumber, setPasswordNumber] = useState<ValidityStatus>("neutral");
  const [passwordSpecial, setPasswordSpecial] = useState<ValidityStatus>("neutral");
  const [passwordLength, setPasswordLength] = useState<ValidityStatus>("neutral");
  const [passwordMatch, setPasswordMatch] = useState<ValidityStatus>("neutral");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // validate email (x@x.x)
  const validateEmail = () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValidity(validEmail ? "valid" : "warning");
  };

  // validate password (length, uppercase, number, special char)
  const validatePassword = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const requiredLength = 8;
    const lengthValid = password.length >= requiredLength;

    setPasswordUpper(hasUpper ? "valid" : "warning");
    setPasswordNumber(hasNumber ? "valid" : "warning");
    setPasswordSpecial(hasSpecial ? "valid" : "warning");
    setPasswordLength(lengthValid ? "valid" : "warning");
  };

  // validate confirm password (match password)
  const validateConfirmPassword = () => {
    setPasswordMatch(confirmPassword === password && confirmPassword !== "" ? "valid" : "warning");
  };

  // debounce email validation for warnings
  useEffect(() => {
    if (type === "signup" && emailTouched) {
      validateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail, emailTouched]); // Use debouncedEmail instead of email

  // debounce password validation for warnings
  useEffect(() => {
    if (type === "signup" && passwordTouched) {
      validatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, passwordTouched]); // Use debouncedPassword instead of password

  // debounce confirm password validation for warnings
  useEffect(() => {
    if (type === "signup" && confirmPasswordTouched) {
      validateConfirmPassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, debouncedConfirmPassword, confirmPasswordTouched]);

  // check if any part of form is empty
  const isFormEmpty = (): boolean => {
    if (!email) {
      setErrorMessage("Email is required");
      return false;
    } else if (!password) {
      setErrorMessage("Password is required");
      return false;
    } else if (!confirmPassword) {
      setErrorMessage("Confirm Password is required");
      return false;
    }
    return true;
  };

  // handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // return early if form is empty
    if (!isFormEmpty()) {
      return;
    }

    // run all validations again
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    // block submission if any validity check fails
    if (emailValidity !== "valid") {
      setErrorMessage("Enter a valid email");
      return;
    } else if (passwordUpper !== "valid" || passwordNumber !== "valid" || passwordSpecial !== "valid" || passwordLength !== "valid") {
      setErrorMessage("Enter a valid password");
      return;
    } else if (passwordMatch !== "valid") {
      setErrorMessage("Passwords must match");
      return;
    }

    authenticateSubmission();
  };

  // authenticate with supabase
  const authenticateSubmission = async () => {
    // login
    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMessage(error.message);
    }
    // signup
    else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card-title">{authTitle}</h2>
      <form className="auth-card-form" onSubmit={handleSubmit}>
        <InputSideIcon label="Email" mode="validityCheck" status={emailValidity}>
          <input
            className="auth-card-form-input"
            id="auth-card-form-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailTouched(true)}
          />
        </InputSideIcon>

        <InputIconGroup
          validityStatuses={[
            { label: "8 Characters", status: passwordLength },
            { label: "Uppercase", status: passwordUpper },
            { label: "Number", status: passwordNumber },
            { label: "Special Character", status: passwordSpecial }
          ]}
        >
          <InputSideIcon label="Password" mode="visibilityToggle" toggleIcon={passwordVisible} onToggle={() => setPasswordVisible(!passwordVisible)}>
            <input
              className="auth-card-form-input"
              id="auth-card-form-password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setPasswordTouched(true);
              }}
            />
          </InputSideIcon>
        </InputIconGroup>

        <InputSideIcon label="Confirm Password" mode="validityCheck" status={passwordMatch}>
          <input
            className="auth-card-form-input"
            id="auth-card-form-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => {
              setConfirmPasswordTouched(true);
            }}
          />
        </InputSideIcon>

        <SubmitButton label={authButtonLabel}></SubmitButton>
        {errorMessage && <Toast message={errorMessage} type="error" onClose={() => setErrorMessage(null)} duration={5000} />}
      </form>
    </div>
  );
}
