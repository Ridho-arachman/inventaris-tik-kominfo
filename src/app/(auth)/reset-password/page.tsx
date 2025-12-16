import ResetPasswordComponent from "@/components/auth/ResetPasswordComponent";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <SuspenseFallback>Loading reset password token...</SuspenseFallback>
      }
    >
      <ResetPasswordComponent />
    </Suspense>
  );
}
