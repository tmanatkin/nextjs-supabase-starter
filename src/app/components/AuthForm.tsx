"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isValid, setIsValid] = useState(false);

  // email and password validation
  useEffect(() => {
    let emailErr: string | null = null;
    let passwordErr: string | null = null;

    // login
    if (type === "login") {
      emailErr = email.length === 0 ? "Email is required" : null;
      passwordErr = password.length === 0 ? "Password is required" : null;
    }
    // signup
    else {
      const passwordHasUpper = /[A-Z]/.test(password);
      const passwordHasNumber = /\d/.test(password);
      const passwordHasSpecial = /[^A-Za-z0-9]/.test(password);
      const passwordLengthValid = password.length >= 8;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      // email
      emailErr = email && !emailValid ? "Enter a valid email: example@example.com" : null;

      // password
      if (!passwordLengthValid) {
        passwordErr = `Password must be at least 8 characters.`;
      } else if (!passwordHasUpper || !passwordHasNumber || !passwordHasSpecial) {
        passwordErr = "Password must include uppercase, number, and symbol.";
      }
    }

    // set errors and validity
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setIsValid(!emailErr && !passwordErr);
  }, [password, email, type]); // dependencies

  // evaluate submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // login
    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setSubmitError(error.message);
    }
    // signup
    else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setSubmitError(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={!isValid}>
          {type === "login" ? "Login" : "Sign Up"}
        </button>
        {submitError && <p className="error-message">{submitError}</p>}
        {emailError && <p className="error-message">{emailError}</p>}
        {passwordError && <p className="error-message">{passwordError}</p>}
      </form>
    </div>
  );
}
