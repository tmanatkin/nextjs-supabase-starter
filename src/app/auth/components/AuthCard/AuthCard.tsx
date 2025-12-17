"use client";

import { isEmailRegistered, login, signup, sendPasswordRecovery, updatePassword } from "../../actions";
import { Status } from "@/types/Status";
import { useState, useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import Link from "next/link";
import { createClientsideClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, CircleCheck, CircleAlert, Circle } from "lucide-react";

type AuthCardProps = {
  authType: "login" | "signup" | "account-recovery" | "update-password";
};

export default function AuthCard({ authType }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramEmail = searchParams.get("email") ?? "";

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

  const [email, setEmail] = useState(authType === "account-recovery" ? paramEmail : "");
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ValidationIcon = ({ status }: { status: Status }) => {
    if (status === "success") return <CircleCheck className="h-4 w-4 text-green-600" />;
    if (status === "warning") return <CircleAlert className="h-4 w-4 text-destructive" />;
    // fallback is neutral
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  // authenticate user client-side before allowing them to changing password
  // -- needs to be done to authenticate using url query param "code" from the password recovery email link
  useEffect(() => {
    async function updatePasswordClientsideAuth() {
      // only need supabase clientside client if changing password
      if (authType === "update-password") {
        const supabase = createClientsideClient();
        const { error } = await supabase.auth.getUser();
        // if not authenticated, redirect to error page
        if (error) {
          router.push("/info/update-password-auth-missing");
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

  // validate email on initial load for account-recovery when using email query param
  useEffect(() => {
    if (authType === "account-recovery" && paramEmail !== "") {
      validateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setIsSubmitting(true);

    // email
    // login, signup, and account-recovery
    if (authType === "login" || authType === "signup" || authType === "account-recovery") {
      if (!email) {
        toast.error("Email is required");
        setIsSubmitting(false);
        return;
      } else if (!validateEmail()) {
        toast.error("Enter a valid email");
        setIsSubmitting(false);
        return;
      }
    }

    // check if email is already registered
    // signup
    if (authType === "signup") {
      const userExists = await isEmailRegistered(email);
      if (userExists) {
        toast.error("An account with this email already exists", {
          action: {
            label: "Log In",
            onClick: () => router.push("/auth/login"),
          },
        });
        setIsSubmitting(false);
        return;
      }
    }

    // check if email is not registered
    // account-recovery
    if (authType === "account-recovery") {
      const userExists = await isEmailRegistered(email);
      if (!userExists) {
        toast.error("No account with this email exists", {
          action: {
            label: "Sign Up",
            onClick: () => router.push("/auth/signup"),
          },
        });
        setIsSubmitting(false);
        return;
      }
    }

    // password
    // login, signup, and update-password
    if (authType === "signup" || authType === "login" || authType === "update-password") {
      if (!password) {
        toast.error("Password is required");
        setIsSubmitting(false);
        return;
      } else if ((authType === "signup" || authType === "update-password") && !validatePassword()) {
        toast.error("Enter a valid password");
        setIsSubmitting(false);
        return;
      }
    }

    // confirm password
    // signup and update-password
    if (authType === "signup" || authType === "update-password") {
      if (!confirmPassword) {
        toast.error("Confirm password is required");
        setIsSubmitting(false);
        return;
      } else if (!validateConfirmPassword()) {
        toast.error("Passwords must match");
        setIsSubmitting(false);
        return;
      }
    }

    await authenticateSubmission();
    setIsSubmitting(false);
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
      toast.error(result.error);
    }
    // redirect user to home page for login and update-password
    else if (authType === "login" || authType === "update-password") {
      window.location.href = "/"; // full page reload
    }
    // redirect to email validate page for signup
    else if (authType === "signup") {
      router.push("/info/verify-email");
    }
    // notify user that recovery email was sent
    else if (authType === "account-recovery") {
      toast.success("Recovery email sent");
    }
    // catch if unexpected authType (should never happen)
    else {
      toast.error("Unexpected error occurred");
    }
  };

  // show nothing when in loading state
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{authTitle}</CardTitle>
          {authType === "account-recovery" && (
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            {(authType === "login" || authType === "signup" || authType === "account-recovery") && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailTouched(true)}
                  />
                  {authType !== "login" && emailTouched && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ValidationIcon status={emailValidity} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Input */}
            {(authType === "login" || authType === "signup" || authType === "update-password") && (
              <div className="space-y-2">
                <Label htmlFor="password">{authType === "update-password" ? "New Password" : "Password"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordTouched(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {(authType === "signup" || authType === "update-password") && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <ValidationIcon status={passwordLength} />
                      <span>8 Characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon status={passwordUpper} />
                      <span>Uppercase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon status={passwordNumber} />
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ValidationIcon status={passwordSpecial} />
                      <span>Special Character</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password Input */}
            {(authType === "signup" || authType === "update-password") && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {authType === "update-password" ? "Confirm New Password" : "Confirm Password"}
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordTouched(true)}
                  />
                  {confirmPasswordTouched && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ValidationIcon status={passwordMatch} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : authButtonLabel}
            </Button>

            {/* Auth Navigation Links */}
            <div className="space-y-2 text-center text-sm">
              {authType === "login" && (
                <>
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline">
                      Sign Up
                    </Link>
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/auth/account-recovery${email ? `?email=${encodeURIComponent(email)}` : ""}`)
                    }
                    className="text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </>
              )}
              {authType === "signup" && (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              )}
              {authType === "account-recovery" && (
                <p className="text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
