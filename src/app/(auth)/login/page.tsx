import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">INVENTARIS ALAT TIK</h1>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
