import { Suspense } from "react";
import AuthCard from "../components/AuthCard/AuthCard";

export default function AccountRecoveryPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="account-recovery" />
    </Suspense>
  );
}
