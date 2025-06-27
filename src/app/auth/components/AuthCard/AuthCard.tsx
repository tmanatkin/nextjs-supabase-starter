"use client";

import "./authCard.scss";
import { isEmailRegistered, login, signup, sendPasswordRecovery, updatePassword } from "../../actions";
import { Status } from "@/types/Status";
import { useState, useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import SubmitButton from "./SubmitButton/SubmitButton";
import Toast from "../../../../components/Toast/Toast";
import InputSideIcon from "./InputSideIcon/InputSideIcon";
import InputIconGroup from "./InputIconGroup/InputIconGroup";
import Link from "next/link";
import { createClientsideClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type AuthCardProps = {
  authType: "login" | "signup" | "account-recovery" | "update-password";
};

export default function AuthCard({ authType }: AuthCardProps) {
  const router = useRouter();

  const authTitle =
    authType === "login"
      ? "Welcome Back"
      : authType === "signup"
      ? "Get Started"
      : authType === "account-recovery"
      ? "Forgot Password?"
      : authType === "update-password"
      ? "Secure Your Account"
      : null;
  const authButtonLabel =
    authType === "login"
      ? "Log In"
      : authType === "signup"
      ? "Sign Up"
      : authType === "account-recovery"
      ? "Recover Account"
      : authType === "update-password"
      ? "Update Password"
      : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const debouncedEmail = useDebounce(email, 300);
  const debouncedPassword = useDebounce(password, 300);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [emailValidity, setEmailValidity] = useState<Status>("neutral");
  const [passwordUpper, setPasswordUpper] = useState<Status>("neutral");
  const [passwordNumber, setPasswordNumber] = useState<Status>("neutral");
  const [passwordSpecial, setPasswordSpecial] = useState<Status>("neutral");
  const [passwordLength, setPasswordLength] = useState<Status>("neutral");
  const [passwordMatch, setPasswordMatch] = useState<Status>("neutral");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [message, setMessage] = useState<{ message: React.ReactNode; type: Status } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // authenticate user client-side before allowing them to changing password
  // -- needs to be done to authenticate using url query param "code" from the password recovery email link
  useEffect(() => {
    async function updatePasswordClientsideAuth() {
      // only need supabase clientside client if changing password
      if (authType === "update-password") {
        const supabase = createClientsideClient();
        const { error } = await supabase.auth.getUser();

        // if not authenticated, redirect to login
        if (error) {
          router.push("/auth/login");
          return;
        }
      }

      // if authenticated, show page as normal
      setIsLoading(false);
    }

    updatePasswordClientsideAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // validate email (x@x.x)
  const validateEmail = (): boolean => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValidity(validEmail ? "success" : "warning");
    return validEmail;
  };

  // validate password (length, uppercase, number, special char)
  const validatePassword = (): boolean => {
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const requiredLength = 8;
    const lengthValid = password.length >= requiredLength;

    setPasswordUpper(hasUpper ? "success" : "warning");
    setPasswordNumber(hasNumber ? "success" : "warning");
    setPasswordSpecial(hasSpecial ? "success" : "warning");
    setPasswordLength(lengthValid ? "success" : "warning");
    return hasUpper && hasNumber && hasSpecial && lengthValid;
  };

  // validate confirm password (match password)
  const validateConfirmPassword = (): boolean => {
    const validConfirmPassword = confirmPassword === password && confirmPassword !== "";
    setPasswordMatch(validConfirmPassword ? "success" : "warning");
    return validConfirmPassword;
  };

  // debounce email validation for warnings
  useEffect(() => {
    if ((authType === "signup" || authType === "account-recovery") && emailTouched) {
      validateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail, emailTouched]); // Use debouncedEmail instead of email

  // debounce password validation for warnings
  useEffect(() => {
    if ((authType === "signup" || authType === "update-password") && passwordTouched) {
      validatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, passwordTouched]); // Use debouncedPassword instead of password

  // debounce confirm password validation for warnings
  useEffect(() => {
    if ((authType === "signup" || authType === "update-password") && confirmPasswordTouched) {
      validateConfirmPassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword, debouncedConfirmPassword, confirmPasswordTouched]);

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // email
    // login, signup, and account-recovery
    if (authType === "login" || authType === "signup" || authType === "account-recovery") {
      if (!email) {
        setMessage({ message: "Email is required", type: "error" });
        return;
      } else if (!validateEmail()) {
        setMessage({ message: "Enter a valid email", type: "error" });
        return;
      }
    }

    // check if email is already registered
    // signup
    if (authType === "signup") {
      const userExists = await isEmailRegistered(email);
      if (userExists) {
        setMessage({
          message: (
            <>
              An account with this email already exists
              <br />
              <Link href="/auth/login">Log In</Link> instead?
            </>
          ),
          type: "error"
        });
        return;
      }
    }

    // check if email is not registered
    // account-recovery
    if (authType === "account-recovery") {
      const userExists = await isEmailRegistered(email);
      if (!userExists) {
        setMessage({
          message: (
            <>
              No account with this email exists
              <br />
              <Link href="/auth/signup">Sign Up</Link> instead?
            </>
          ),
          type: "error"
        });
        return;
      }
    }

    // password
    // login, signup, and update-password
    if (authType === "signup" || authType === "login" || authType === "update-password") {
      if (!password) {
        setMessage({ message: "Password is required", type: "error" });
        return;
      } else if (!validatePassword()) {
        setMessage({ message: "Enter a valid password", type: "error" });
        return;
      }
    }

    // confirm password
    // signup and update-password
    if (authType === "signup" || authType === "update-password") {
      if (!confirmPassword) {
        setMessage({ message: "Confirm password is required", type: "error" });
        return;
      } else if (!validateConfirmPassword()) {
        setMessage({ message: "Passwords must match", type: "error" });
        return;
      }
    }

    authenticateSubmission();
  };

  // authenticate with supabase
  const authenticateSubmission = async () => {
    let result;

    // login
    if (authType === "login") {
      result = await login({ email, password });
    }
    // signup
    else if (authType === "signup") {
      result = await signup({ email, password });
    }
    // account-recovery
    else if (authType === "account-recovery") {
      result = await sendPasswordRecovery(email);
    }
    // update-password
    else if (authType === "update-password") {
      result = await updatePassword(password);
    }

    // error handling
    if (result?.error) {
      setMessage({ message: result.error, type: "error" });
    }
    // redirect user to home page for login, and update-assword
    else if (authType === "login" || authType === "update-password") {
      window.location.href = "/"; // full page reload
    }
    // redirect to email validate page for signup
    else if (authType === "signup") {
      router.push("/info/verify-email");
    }
    // notify user that recovery email was sent
    else if (authType === "account-recovery") {
      setMessage({ message: "Recovery email sent", type: "success" });
    }
    // catch if unexpected authType (should never happen)
    else {
      setMessage({ message: "Unexpected error occurred", type: "error" });
    }
  };

  // show nothing when in loading state
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card-title">{authTitle}</h2>
      <form className="auth-card-form" onSubmit={handleSubmit}>
        {/* email */}
        {(authType === "login" || authType === "signup" || authType === "account-recovery") && (
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
        )}

        {/* password */}
        {(authType === "login" || authType === "signup" || authType === "update-password") && (
          <InputIconGroup
            hideIcons={authType === "login"}
            validityStatuses={[
              { label: "8 Characters", status: passwordLength },
              { label: "Uppercase", status: passwordUpper },
              { label: "Number", status: passwordNumber },
              { label: "Special Character", status: passwordSpecial }
            ]}
          >
            <InputSideIcon
              label={authType === "update-password" ? "New Password" : "Password"}
              mode="visibilityToggle"
              toggleIcon={passwordVisible}
              onToggle={() => setPasswordVisible(!passwordVisible)}
            >
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
        )}

        {/* confirm password */}
        {(authType === "signup" || authType === "update-password") && (
          <InputSideIcon
            label={authType === "update-password" ? "Confirm New Password" : "Confirm Password"}
            mode="validityCheck"
            status={passwordMatch}
          >
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

        {/* submit button */}
        <SubmitButton label={authButtonLabel ?? ""}></SubmitButton>

        {/* auth navigation link */}
        <div className="auth-nav-link">
          {authType === "login" ? (
            <>
              <p>
                {"Don't have an account? "}
                <Link href="/auth/signup">Sign Up</Link>
              </p>
              <p>
                <Link href="/auth/account-recovery">Forgot Password?</Link>
              </p>
            </>
          ) : authType === "signup" ? (
            <p>
              {"Already have an account? "}
              <Link href="/auth/login">Log In</Link>
            </p>
          ) : authType === "account-recovery" ? (
            <p>
              {"Remember your password? "}
              <Link href="/auth/login">Log In</Link>
            </p>
          ) : authType === "update-password" ? null : null}
        </div>

        {/* error message */}
        {message && <Toast message={message.message} type={message.type} onClose={() => setMessage(null)} duration={5000} />}
      </form>
    </div>
  );
}
