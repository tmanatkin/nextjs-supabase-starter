"use client";

import "./authCard.scss";
import ValidityIcon from "./ValidityIcon/ValidityIcon";
import { useState, useEffect } from "react";
import useDebounce from "../../../../lib/hooks/useDebounce";
import { supabase } from "../../../../lib/supabaseClient";
import SubmitButton from "./SubmitButton/SubmitButton";

type AuthCardProps = {
  type: "login" | "signup";
};

export default function AuthCard({ type }: AuthCardProps) {
  const authButtonLabel = type === "login" ? "Log In" : "Sign Up";
  const authTitle = type === "login" ? "Welcome Back" : "Get Started";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const debouncedEmail = useDebounce(email, 300); // 300ms delay
  const debouncedPassword = useDebounce(password, 300);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [emailValidity, setEmailValidity] = useState<"neutral" | "valid" | "error" | "warning">("neutral");
  const [passwordUpper, setPasswordUpper] = useState<"neutral" | "valid" | "error" | "warning">("neutral");
  const [passwordNumber, setPasswordNumber] = useState<"neutral" | "valid" | "error" | "warning">("neutral");
  const [passwordSpecial, setPasswordSpecial] = useState<"neutral" | "valid" | "error" | "warning">("neutral");
  const [passwordLength, setPasswordLength] = useState<"neutral" | "valid" | "error" | "warning">("neutral");
  const [passwordMatch, setPasswordMatch] = useState<"neutral" | "valid" | "error" | "warning">("neutral");

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

  // Update the useEffect hooks to use debounced values
  useEffect(() => {
    if (type === "signup" && emailTouched) {
      validateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail, emailTouched]); // Use debouncedEmail instead of email

  useEffect(() => {
    if (type === "signup" && passwordTouched) {
      validatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, passwordTouched]); // Use debouncedPassword instead of password

  useEffect(() => {
    if (type === "signup" && confirmPasswordTouched) {
      validateConfirmPassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, debouncedConfirmPassword, confirmPasswordTouched]);

  // useEffect(() => {
  //   if (type === "signup" && emailTouched) {
  //     validateEmail();
  //   }
  // }, [email, emailTouched]);

  // useEffect(() => {
  //   if (type === "signup" && passwordTouched) {
  //     validatePassword();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [password, passwordTouched]);

  // useEffect(() => {
  //   if (type === "signup" && confirmPasswordTouched) {
  //     validateConfirmPassword();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [password, confirmPassword, confirmPasswordTouched]);

  // check if any part of form is empty
  const isFormEmpty = (): boolean => {
    if (!email && !password) {
      setErrorMessage("Email and password are required");
      return false;
    } else if (!email) {
      setErrorMessage("Email is required");
      return false;
    } else if (!password) {
      setErrorMessage("Password is required");
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
        <label className="auth-card-form-label" htmlFor="email">
          Email
        </label>
        <div className="auth-card-form-input-container">
          <input
            className="auth-card-form-email auth-card-form-input"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailTouched(true)}
          />
          {type === "signup" && <ValidityIcon status={emailValidity} nextToInput />}
        </div>
        <label className="auth-card-form-label" htmlFor="password">
          Password
        </label>
        <div className="auth-card-form-input-container">
          <input
            className="auth-card-form-password auth-card-form-input"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => {
              setPasswordTouched(true);
            }}
          />
        </div>
        {type === "signup" && (
          <>
            <div className="auth-card-form-validity-icon-group">
              <ValidityIcon status={passwordLength} label="8 Characters" />
              <ValidityIcon status={passwordUpper} label="Uppercase" />
              <ValidityIcon status={passwordNumber} label="Number" />
              <ValidityIcon status={passwordSpecial} label="Special Character" />
            </div>
            <label className="auth-card-form-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="auth-card-form-input-container">
              <input
                className="auth-card-form-confirm-password auth-card-form-input"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => {
                  setConfirmPasswordTouched(true);
                }}
              ></input>
              <ValidityIcon status={passwordMatch} nextToInput />
            </div>
          </>
        )}

        <SubmitButton label={authButtonLabel}></SubmitButton>
        {errorMessage && <p className="auth-error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}
