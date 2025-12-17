import { Suspense } from "react";
import AuthCard from "../components/AuthCard/AuthCard";

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="signup" />
    </Suspense>
  );
}
