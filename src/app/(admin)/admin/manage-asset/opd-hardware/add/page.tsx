"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { useGet, usePost } from "@/hooks/useApi";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";

import { Calendar } from "@/components/ui/calendar";
import { StatusAset, SumberPengadaan } from "@/generated/enums";
import { KategoriHardware, Opd } from "@/generated/client";
import { useRouter } from "next/navigation";

export default function AddHardwareForm() {
  const router = useRouter();
  const { loading, post } = usePost("/hardware");
  const { data: opd, error: opdError, isLoading: opdLoading } = useGet("/opd");
  const {
    data: kategori,
    error: kategoriError,
    isLoading: kategoriLoading,
  } = useGet("/hardware/kategori");
  const form = useForm<z.infer<typeof hardwareSchema>>({
    resolver: zodResolver(hardwareSchema),
    defaultValues: {
      status: "AKTIF",
      sumber: "PEMBELIAN",
      tglPengadaan: undefined,
      garansiMulai: undefined,
      garansiSelesai: undefined,
      biayaPerolehan: "",
      kategoriId: "",
      lokasiFisik: "",
      nama: "",
      merk: "",
      penyedia: "",
      pic: "",
      spesifikasi: "",
      nomorSeri: "",
    },
  });

  async function onSubmit(values: z.infer<typeof hardwareSchema>) {
    try {
      const payload = {
        ...values,
        tglPengadaan: values.tglPengadaan?.toISOString(),
        garansiMulai: values.garansiMulai?.toISOString(),
        garansiSelesai: values.garansiSelesai?.toISOString(),
      };

      const res = await post(payload);
      notifier.success(
        "Berhasil Menambahkan",
        `Hardware ${res.data.nama} berhasil ditambahkan`
      );

      router.push("/admin/manage-asset/opd-hardware");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.log(err);
      notifier.error(
        "Gagal Menambahkan",
        err.response?.data.message || "Gagal menambahkan hardware"
      );
    }
  }

  const renderCalendarField = (
    name: keyof z.infer<typeof hardwareSchema>,
    label: string
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
                className="rounded-lg border shadow-sm"
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );

  return (
    <Card className="w-full sm:max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Tambah Hardware</CardTitle>
        <CardDescription>
          Isi data hardware baru sesuai form berikut
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-add-hardware" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Dell"
                  />
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
                const currentLength = field.value?.length ?? 0;
                const maxLength = 255;

                return (
                  <Field
                    data-invalid={
                      fieldState.invalid || currentLength > maxLength
                    }
                  >
                    <FieldLabel>Spesifikasi</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Intel i7, 16GB RAM, 512GB SSD"
                        rows={4}
                        className={`min-h-24 resize-none ${
                          currentLength >= maxLength ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          const val = e.target.value;

                          // Cegah pengetikan jika lebih dari 255
                          if (val.length <= maxLength) {
                            field.onChange(val);
                          }
                        }}
                      />

                      <InputGroupAddon align="block-end">
                        <InputGroupText
                          className={`tabular-nums ${
                            currentLength >= maxLength ? "text-red-500" : ""
                          }`}
                        >
                          {currentLength}/{maxLength}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    {(fieldState.invalid || currentLength > maxLength) && (
                      <FieldError
                        errors={[
                          fieldState.error ?? {
                            message: `Maksimal 255 karakter`,
                          }, // ⬅ hanya message saja
                        ]}
                      />
                    )}
                  </Field>
                );
              }}
            />

            {/* Lokasi Fisik */}
            <Controller
              name="lokasiFisik"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Lokasi Fisik</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Ruang IT Lantai 2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Tanggal */}
            {renderCalendarField("tglPengadaan", "Tanggal Pengadaan")}
            {renderCalendarField("garansiMulai", "Garansi Mulai")}
            {renderCalendarField("garansiSelesai", "Garansi Selesai")}
            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(StatusAset).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "AKTIF" ? "Aktif" : "Tidak Aktif"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* PIC */}
            <Controller
              name="pic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>PIC</FieldLabel>
                  <Input {...field} placeholder="Ridho Arachman" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Biaya Perolehan */}
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
            {/* Nomor Seri */}
            <Controller
              name="nomorSeri"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nomor Seri</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="SN123456789"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Sumber Pengadaan */}
            <Controller
              name="sumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Sumber Pengadaan</FieldLabel>

                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SumberPengadaan).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Penyedia */}
            <Controller
              name="penyedia"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Penyedia</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="PT. ABC Teknologi"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* OPD ID */}
            <Controller
              name="opdId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>OPD</FieldLabel>

                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={opdLoading || !!opdError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih OPD" />
                    </SelectTrigger>

                    <SelectContent>
                      {opd?.map((item: Opd) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Kategori Hardware */}
            <Controller
              name="kategoriId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Kategori Hardware</FieldLabel>

                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={kategoriLoading || !!kategoriError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori hardware" />
                    </SelectTrigger>

                    <SelectContent>
                      {kategori?.map((item: KategoriHardware) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
            disabled={loading}
            className="cursor-pointer"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer"
            form="form-add-hardware"
          >
            Simpan Hardware
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
