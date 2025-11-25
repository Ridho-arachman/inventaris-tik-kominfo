"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Dummy Data OPD
const dummyOPD = {
  id: 1,
  name: "Dinas Pendidikan",
  email: "pendidikan@domain.go.id",
  phone: "021-123456",
  totalUsers: 25,
};

export default function EditOPDPage() {
  const opdSchema = z.object({
    name: z.string().min(3, "Nama OPD minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    phone: z.string().min(5, "Telepon minimal 5 karakter"),
    totalUsers: z.number().min(0, "Jumlah user minimal 0"),
  });

  type OPDForm = z.infer<typeof opdSchema>;

  const form = useForm<OPDForm>({
    resolver: zodResolver(opdSchema),
    defaultValues: {
      name: dummyOPD.name,
      email: dummyOPD.email,
      phone: dummyOPD.phone,
      totalUsers: dummyOPD.totalUsers,
    },
  });

  const onSubmit = (data: OPDForm) => {
    console.log("Data OPD diperbarui:", data);
    alert("OPD berhasil diperbarui (dummy).");
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Edit OPD
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Edit Informasi OPD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama OPD
                </label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Telepon
                </label>
                <Input {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Jumlah User
                </label>
                <Input
                  type="number"
                  {...form.register("totalUsers", { valueAsNumber: true })}
                />
                {form.formState.errors.totalUsers && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.totalUsers.message}
                  </p>
                )}
              </div>

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
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
