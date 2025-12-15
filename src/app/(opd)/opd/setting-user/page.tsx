"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSettingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen px-6 py-10  space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan keamanan Anda
        </p>
      </div>

      {/* PROFILE SECTION */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Ubah nama tampilan akun</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/setting-user/edit-profile")}
            className="cursor-pointer"
          >
            Edit Profil
          </Button>
        </CardContent>
      </Card>

      {/* PASSWORD SECTION */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <CardTitle>Keamanan Akun</CardTitle>
            <CardDescription>Ganti password akun Anda</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => router.push("/admin/setting-user/edit-password")}
            className="cursor-pointer"
          >
            Ganti Password
          </Button>
        </CardContent>
      </Card>

      {/* EMAIL SECTION */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <CardTitle>Email Akun</CardTitle>
            <CardDescription>
              Mengubah email memerlukan verifikasi ulang
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/setting-user/edit-email")}
            className="cursor-pointer"
          >
            Ganti Email
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* INFO */}
      <p className="text-sm text-muted-foreground text-center">
        Demi keamanan, beberapa perubahan memerlukan verifikasi tambahan.
      </p>
    </div>
  );
}
