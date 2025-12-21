"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { hardwareSchema } from "@/schema/hardwareSchema";
import z from "zod";
import { useGet, usePut } from "@/hooks/useApi";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";

import { Calendar } from "@/components/ui/calendar";
import { StatusAset, SumberPengadaan } from "@/generated/enums";
import { KategoriHardware, Opd } from "@/generated/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function EditHardwareForm() {
  const { id } = useParams();
  const router = useRouter();
  const { loading, put } = usePut(`/hardware/${id}`);

  const {
    data: hardware,
    error: hardwareError,
    isLoading: hardwareLoading,
  } = useGet(`/hardware/${id}`);

  const CURRENT_YEAR = new Date().getFullYear();
  const TO_YEAR = CURRENT_YEAR + 10;

  const { data: opd } = useGet("/opd");
  const { data: kategori } = useGet("/hardware/kategori");

  const form = useForm<z.infer<typeof hardwareSchema>>({
    resolver: zodResolver(hardwareSchema),
    defaultValues: {
      nama: "",
      merk: "",
      spesifikasi: "",
      lokasiFisik: "",
      pic: "",
      biayaPerolehan: undefined,
      nomorSeri: "",
      penyedia: "",
      status: "AKTIF",
      sumber: "PEMBELIAN",
      kategoriId: "",
      opdId: "",
      tglPengadaan: undefined,
      garansiMulai: undefined,
      garansiSelesai: undefined,
    },
  });

  useEffect(() => {
    if (hardware) {
      const h = hardware;
      form.reset({
        nama: h.nama,
        merk: h.merk,
        spesifikasi: h.spesifikasi,
        lokasiFisik: h.lokasiFisik,
        pic: h.pic,
        biayaPerolehan: h.biayaPerolehan,
        nomorSeri: h.nomorSeri,
        penyedia: h.penyedia,
        status: h.status ?? "AKTIF",
        sumber: h.sumber ?? "PEMBELIAN",
        kategoriId: h.kategoriId,
        opdId: h.opdId,

        // handle date
        tglPengadaan: h.tglPengadaan ? new Date(h.tglPengadaan) : undefined,
        garansiMulai: h.garansiMulai ? new Date(h.garansiMulai) : undefined,
        garansiSelesai: h.garansiSelesai
          ? new Date(h.garansiSelesai)
          : undefined,
      });
    }
  }, [hardware, form]);

  const sumber = useWatch({
    control: form.control,
    name: "sumber",
  });

  useEffect(() => {
    if (
      sumber === SumberPengadaan.HIBAH ||
      sumber === SumberPengadaan.TRANSFER_OPD
    ) {
      form.setValue("biayaPerolehan", null);
    }
  }, [sumber, form]);

  const resetToInitial = () => {
    if (!hardware) return;

    form.reset({
      nama: hardware.nama,
      merk: hardware.merk,
      spesifikasi: hardware.spesifikasi,
      lokasiFisik: hardware.lokasiFisik,
      pic: hardware.pic,
      biayaPerolehan: hardware.biayaPerolehan,
      nomorSeri: hardware.nomorSeri,
      penyedia: hardware.penyedia,
      status: hardware.status ?? "AKTIF",
      sumber: hardware.sumber ?? "PEMBELIAN",
      kategoriId: hardware.kategoriId,
      tglPengadaan: hardware.tglPengadaan
        ? new Date(hardware.tglPengadaan)
        : undefined,
      garansiMulai: hardware.garansiMulai
        ? new Date(hardware.garansiMulai)
        : undefined,
      garansiSelesai: hardware.garansiSelesai
        ? new Date(hardware.garansiSelesai)
        : undefined,
    });
  };

  async function onSubmit(values: z.infer<typeof hardwareSchema>) {
    try {
      const payload = {
        ...values,
        tglPengadaan: values.tglPengadaan?.toISOString(),
        garansiMulai: values.garansiMulai?.toISOString(),
        garansiSelesai: values.garansiSelesai?.toISOString(),
      };

      await put(payload);

      notifier.success("Berhasil", "Hardware berhasil diperbarui!");
      router.push("/admin/manage-asset/opd-hardware");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(
        "Gagal Update",
        err.response?.data.message || "Gagal memperbarui hardware."
      );
    }
  }

  // SHARED DATE PICKER
  const renderCalendarField = (
    name: keyof z.infer<typeof hardwareSchema>,
    label: string,
    toYear: number
  ) => (
    <Controller
      key={name}
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full text-left">
                {field.value instanceof Date
                  ? format(field.value, "yyyy-MM-dd")
                  : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value instanceof Date ? field.value : undefined}
                onSelect={(date) => field.onChange(date ?? undefined)}
                captionLayout="dropdown"
                toYear={toYear}
                className="rounded-lg border shadow-sm"
              />
            </PopoverContent>
          </Popover>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );

  if (hardwareLoading) {
    <Card className="w-full sm:max-w-3xl mx-auto">
      <CardHeader>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-72 bg-gray-200 rounded animate-pulse" />
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="flex flex-col gap-2" key={i}>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex gap-4 w-full">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>;
  }

  if (hardwareError || !hardware) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-3"
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 text-lg font-medium">
          Gagal memuat data hardware
        </p>
        <p className="text-gray-500 text-sm">
          Silakan coba muat ulang atau periksa koneksi internet Anda.
        </p>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Hardware</CardTitle>
        <CardDescription>
          Perbarui data hardware sesuai kebutuhan
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="edit-hardware-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ========================= */}
            {/* Semua field yang sudah kamu buat */}
            {/* ========================= */}

            {/* Nama */}
            <Controller
              name="nama"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nama Hardware</FieldLabel>
                  <Input {...field} placeholder="Laptop Dell Inspiron" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Merk */}
            <Controller
              name="merk"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Merk</FieldLabel>
                  <Input {...field} placeholder="DELL" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Spesifikasi */}
            <Controller
              name="spesifikasi"
              control={form.control}
              render={({ field, fieldState }) => {
                const curr = field.value?.length ?? 0;
                const max = 255;

                return (
                  <Field data-invalid={fieldState.invalid || curr > max}>
                    <FieldLabel>Spesifikasi</FieldLabel>

                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        rows={4}
                        className="min-h-24 resize-none"
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText>
                          {curr}/{max}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Lokasi */}
            <Controller
              name="lokasiFisik"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Lokasi Fisik</FieldLabel>
                  <Input {...field} placeholder="Ruang Server" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Sumber */}
            <Controller
              name="sumber"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Sumber Pengadaan</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(SumberPengadaan).map((x) => (
                        <SelectItem key={x} value={x}>
                          {x.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* Tanggal */}
            {renderCalendarField(
              "tglPengadaan",
              "Tanggal Pengadaan",
              CURRENT_YEAR
            )}
            {renderCalendarField("garansiMulai", "Garansi Mulai", CURRENT_YEAR)}
            {renderCalendarField("garansiSelesai", "Garansi Selesai", TO_YEAR)}

            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(StatusAset).map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* PIC */}
            <Controller
              name="pic"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>PIC</FieldLabel>
                  <Input {...field} placeholder="Ridho Arachman" />
                </Field>
              )}
            />

            {/* Biaya */}
            {(sumber === "PEMBELIAN" || sumber === "PROYEK_PAKET") && (
              <Controller
                name="biayaPerolehan"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Biaya Perolehan</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>Rp</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        placeholder="15000000"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {/* Nomor Seri */}
            <Controller
              name="nomorSeri"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nomor Seri</FieldLabel>
                  <Input {...field} placeholder="SN123..." />
                </Field>
              )}
            />

            {/* Penyedia */}
            <Controller
              name="penyedia"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Penyedia</FieldLabel>
                  <Input
                    {...field}
                    placeholder="PT ABC"
                    value={field.value || ""}
                  />
                </Field>
              )}
            />

            {/* OPD */}
            <Controller
              name="opdId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>OPD</FieldLabel>

                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih OPD" />
                    </SelectTrigger>

                    <SelectContent>
                      {opd?.map((o: Opd) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* Kategori */}
            <Controller
              name="kategoriId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Kategori Hardware</FieldLabel>

                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>

                    <SelectContent>
                      {kategori?.map((k: KategoriHardware) => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetToInitial}
            disabled={loading}
            className="cursor-pointer"
          >
            Reset
          </Button>

          <Button type="submit" form="edit-hardware-form" disabled={loading}>
            Simpan Perubahan
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
