/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dummy User
const dummyUser = {
  id: 100,
  name: "Admin OPD",
  email: "admin@opd.go.id",
};

// Zod Validation
const profileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function UserProfileOPD() {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: dummyUser.name,
      email: dummyUser.email,
      password: "",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile Updated:", data);
    alert("Profile berhasil diperbarui!");
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8"
      >
        Setting Profil
      </motion.h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NAMA */}
              <div>
                <p className="text-sm font-medium mb-1">Nama</p>
                <Input {...form.register("name")} />
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <Input type="email" {...form.register("email")} />
              </div>

              {/* PASSWORD */}
              <div>
                <p className="text-sm font-medium mb-1">Password</p>
                <Input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengganti"
                  {...form.register("password")}
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan Perubahan
              </Button>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
