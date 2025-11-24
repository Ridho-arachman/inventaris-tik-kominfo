"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit } from "lucide-react";

// ================================
// Dummy Asset (sesuai schema)
const dummyAsset = {
  id: 1,
  category: "Laptop",
  brand: "HP",
  model: "Probook 440 G8",
  specification: "Intel i5, SSD 512GB, 8GB RAM",
  acquisitionYear: 2022,
  jmlhAktif: 8,
  jmlhNonaktif: 2,
  jml: 10,
  location: "Ruang Administrasi",
  photoUrl:
    "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress",
};

// Schema Zod
const assetSchema = z.object({
  category: z.string().min(1, "Kategori wajib diisi"),
  acquisitionYear: z.coerce.number().min(0, "Tahun harus angka positif"),
  jmlhAktif: z.coerce.number().min(0, "Jumlah aktif minimal 0"),
  jmlhNonaktif: z.coerce.number().min(0, "Jumlah nonaktif minimal 0"),
  jml: z.coerce.number().min(0, "Jumlah total minimal 0"),

  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  specification: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
});

type AssetForm = z.infer<typeof assetSchema>;

export default function EditAssetOPD() {
  const [preview, setPreview] = useState<string | null>(dummyAsset.photoUrl);

  const form = useForm<AssetForm>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      category: dummyAsset.category,
      acquisitionYear: dummyAsset.acquisitionYear,
      jmlhAktif: dummyAsset.jmlhAktif,
      jmlhNonaktif: dummyAsset.jmlhNonaktif,
      jml: dummyAsset.jml,
      brand: dummyAsset.brand,
      model: dummyAsset.model,
      specification: dummyAsset.specification,
      location: dummyAsset.location,
      photoUrl: dummyAsset.photoUrl,
    },
  });

  const onSubmit = (data: AssetForm) => {
    console.log("Submit data:", data);
    // kirim ke backend / api
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 flex items-center gap-2"
      >
        <Edit />
        <h1>Edit Aset</h1>
      </motion.h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Form Edit Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Kategori */}
              <FormField
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Kategori asset" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Tahun Perolehan */}
              <FormField
                control={form.control}
                name="acquisitionYear"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Tahun Perolehan</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Jumlah Total */}
              <FormField
                control={form.control}
                name="jml"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Jumlah Total</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Jumlah Aktif */}
              <FormField
                control={form.control}
                name="jmlhAktif"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Jumlah Aktif</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Jumlah Nonaktif */}
              <FormField
                control={form.control}
                name="jmlhNonaktif"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Jumlah Nonaktif</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Spesifikasi */}
              <FormField
                control={form.control}
                name="specification"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Spesifikasi</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Lokasi */}
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Photo URL */}
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>URL Foto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPreview(e.target.value);
                        }}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Image Preview */}
              {preview && (
                <div className="w-full h-48 overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={preview}
                    alt="Preview Asset"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <Button type="submit">Simpan Perubahan</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
