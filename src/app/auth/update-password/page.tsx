import { Suspense } from "react";
import AuthCard from "../components/AuthCard/AuthCard";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="update-password" />
    </Suspense>
  );
}
