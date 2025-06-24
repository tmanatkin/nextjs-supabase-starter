"use client";

import "./authCard.scss";
import { isEmailRegistered, login, signup } from "../../actions";
import { ValidityStatus } from "@/types/ValidityStatus";
import { useState, useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import SubmitButton from "./SubmitButton/SubmitButton";
import Toast from "../../../../components/Toast/Toast";
import InputSideIcon from "./InputSideIcon/InputSideIcon";
import InputIconGroup from "./InputIconGroup/InputIconGroup";
import Link from "next/link";

type AuthCardProps = {
  authType: "login" | "signup";
};

export default function AuthCard({ authType }: AuthCardProps) {
  const authButtonLabel = authType === "login" ? "Log In" : "Sign Up";
  const authTitle = authType === "login" ? "Welcome Back" : "Get Started";

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

  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);

  // validate email (x@x.x)
  const validateEmail = (): boolean => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValidity(validEmail ? "valid" : "warning");
    return validEmail;
  };

  // validate password (length, uppercase, number, special char)
  const validatePassword = (): boolean => {
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const requiredLength = 8;
    const lengthValid = password.length >= requiredLength;

    setPasswordUpper(hasUpper ? "valid" : "warning");
    setPasswordNumber(hasNumber ? "valid" : "warning");
    setPasswordSpecial(hasSpecial ? "valid" : "warning");
    setPasswordLength(lengthValid ? "valid" : "warning");
    return hasUpper && hasNumber && hasSpecial && lengthValid;
  };

  // validate confirm password (match password)
  const validateConfirmPassword = (): boolean => {
    const validConfirmPassword = confirmPassword === password && confirmPassword !== "";
    setPasswordMatch(validConfirmPassword ? "valid" : "warning");
    return validConfirmPassword;
  };

  // debounce email validation for warnings
  useEffect(() => {
    if (authType === "signup" && emailTouched) {
      validateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail, emailTouched]); // Use debouncedEmail instead of email

  // debounce password validation for warnings
  useEffect(() => {
    if (authType === "signup" && passwordTouched) {
      validatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, passwordTouched]); // Use debouncedPassword instead of password

  // debounce confirm password validation for warnings
  useEffect(() => {
    if (authType === "signup" && confirmPasswordTouched) {
      validateConfirmPassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, debouncedConfirmPassword, confirmPasswordTouched]);

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("Email is required");
      return;
    } else if (!validateEmail()) {
      setErrorMessage("Enter a valid email");
      return;
    } else if (await isEmailRegistered(email)) {
      setErrorMessage(
        <>
          An account with this email already exists
          <br />
          <Link href="/auth/login">Log In</Link> instead?
        </>
      );
      return;
    } else if (!password) {
      setErrorMessage("Password is required");
      return;
    } else if (!validatePassword()) {
      setErrorMessage("Enter a valid password");
      return;
    } else if (!confirmPassword && authType === "signup") {
      setErrorMessage("Confirm password is required");
      return;
    } else if (!validateConfirmPassword() && authType === "signup") {
      setErrorMessage("Passwords must match");
      return;
    }

    authenticateSubmission();
  };

  // authenticate with supabase
  const authenticateSubmission = async () => {
    const data = { email, password };
    let result;

    // login
    if (authType === "login") {
      result = await login(data);
    }
    // signup
    else {
      result = await signup(data);
    }

    // error handling
    if (result?.error) {
      setErrorMessage(result.error);
    }
    // redirect user
    else {
      window.location.href = "/";
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card-title">{authTitle}</h2>
      <form className="auth-card-form" onSubmit={handleSubmit}>
        <InputSideIcon label="Email" hideIcon={authType === "login"} mode="validityCheck" status={emailValidity}>
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
          hideIcons={authType === "login"}
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
        {authType === "signup" && (
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
        )}
        <SubmitButton label={authButtonLabel}></SubmitButton>
        <p className="switch-auth-link">
          {authType === "login" ? (
            <>
              {"Don't have an account? "}
              <Link href="/auth/signup">Sign Up</Link>
            </>
          ) : (
            <>
              {"Already have an account? "}
              <Link href="/auth/login">Log In</Link>
            </>
          )}
        </p>
        {errorMessage && <Toast message={errorMessage} type="error" onClose={() => setErrorMessage(null)} duration={5000} />}
      </form>
    </div>
  );
}
