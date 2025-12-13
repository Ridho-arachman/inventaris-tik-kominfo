"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { softwareCreateSchema } from "@/schema/softwareSchema";
import {
  JenisLisensi,
  KritikalitasStatus,
  StatusAset,
} from "@/generated/enums";
import { format } from "date-fns";
import z from "zod";
import { useGet, usePut } from "@/hooks/useApi";
import { Hardware, KategoriSoftware, Opd } from "@/generated/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";
import { useParams, useRouter } from "next/navigation";

export default function SoftwareFormComponent() {
  const { id } = useParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { data: opd } = useGet("/opd");
  const { data: kategori } = useGet("/software/kategori");
  const { data: listHardware } = useGet("/list-hardware");
  const { data: software } = useGet(`/software/${id}`);
  const { loading, put } = usePut(`/software/${id}`);
  const form = useForm<z.infer<typeof softwareCreateSchema>>({
    resolver: zodResolver(softwareCreateSchema),
  });

  useEffect(() => {
    if (software) {
      form.reset({
        nama: software?.nama,
        jenisLisensi: software?.jenisLisensi,
        nomorSeri: software?.nomorSeri,
        tglBerakhirLisensi: software.tglBerakhirLisensi
          ? new Date(software.tglBerakhirLisensi)
          : undefined,
        tglPengadaan: software.tglPengadaan
          ? new Date(software.tglPengadaan)
          : undefined,
        versiTerpasang: software?.versiTerpasang,
        vendor: software?.vendor,
        inHouse: software?.inHouse,
        kritikalitas: software?.kritikalitas,
        hargaPerolehan: software?.hargaPerolehan,
        status: software?.status,
        pic: software?.pic,
        opdId: software?.opdId,
        kategoriId: software?.kategoriId,
        hardwareTerinstall: software?.hardwareTerinstall,
      });
      console.log(form.getValues());
    }
  }, [software, form]);

  const jenisLisensi = useWatch({
    name: "jenisLisensi",
    control: form.control,
  });
  const vendor = useWatch({ name: "vendor", control: form.control });

  useEffect(() => {
    form.setValue("inHouse", !vendor);
  }, [vendor, form]);

  const onSubmit = async (values: z.infer<typeof softwareCreateSchema>) => {
    try {
      const payload = {
        ...values,
        tglBerakhirLisensi: values.tglBerakhirLisensi
          ? new Date(values.tglBerakhirLisensi).toISOString()
          : null,
        tglPengadaan: values.tglPengadaan
          ? new Date(values.tglPengadaan).toISOString()
          : null,
      };

      console.log("payload", payload);

      const res = await put(payload);

      notifier.success(
        "Berhasil Menambahkan",
        `Software ${res.data.nama} berhasil ditambahkan`
      );
      router.push("/admin/manage-asset/opd-software");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.log(err);

      notifier.error("Gagal Menambahkan", err.response?.data.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="px-4 "
    >
      <h1 className="text-3xl font-bold mb-8">Tambah Software</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Nama Software */}
        <Controller
          name="nama"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nama Software</FieldLabel>
              <Input {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Jenis Lisensi + Nomor Seri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="jenisLisensi"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Jenis Lisensi</FieldLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Lisensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={JenisLisensi.PERPETUAL}>
                      Perpetual
                    </SelectItem>
                    <SelectItem value={JenisLisensi.LANGGANAN}>
                      Langganan
                    </SelectItem>
                    <SelectItem value={JenisLisensi.OPEN_SOURCE}>
                      Open Source
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="nomorSeri"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nomor Seri</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  disabled={jenisLisensi === JenisLisensi.OPEN_SOURCE}
                  placeholder={
                    jenisLisensi === JenisLisensi.OPEN_SOURCE
                      ? "Tidak diperlukan untuk Open Source"
                      : "Masukkan Nomor Seri"
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Tanggal Lisensi & Tahun Pengadaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jenisLisensi === JenisLisensi.LANGGANAN && (
            <Controller
              name="tglBerakhirLisensi"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tanggal Berakhir Lisensi</FieldLabel>
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            name="tglPengadaan"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tahun Pengadaan</FieldLabel>
                <Input
                  type="date"
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Versi Terpasang */}
        <Controller
          name="versiTerpasang"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Versi Terpasang</FieldLabel>
              <Input {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Vendor & InHouse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Controller
            name="vendor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Vendor</FieldLabel>
                <Input {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="inHouse"
            control={form.control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center gap-3 mt-6">
                  <Checkbox disabled checked={!!field.value} />
                  <FieldLabel>In-house</FieldLabel>
                </div>
              </Field>
            )}
          />
        </div>

        {/* Kritikalitas + Harga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="kritikalitas"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Kritikalitas</FieldLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(KritikalitasStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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

          <Controller
            name="hargaPerolehan"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Harga Perolehan</FieldLabel>
                <Input {...field} type="number" value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Status + PIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(StatusAset).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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

          <Controller
            name="pic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>PIC</FieldLabel>
                <Input {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* OPD + Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="opdId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>OPD</FieldLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih OPD" />
                  </SelectTrigger>
                  <SelectContent>
                    {opd?.map((opd: Opd) => (
                      <SelectItem key={opd.id} value={opd.id}>
                        {opd.nama}
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

          <Controller
            name="kategoriId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Kategori</FieldLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori Software" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategori?.map((kategori: KategoriSoftware) => (
                      <SelectItem key={kategori.id} value={kategori.id}>
                        {kategori.nama}
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
        </div>

        {/* Hardware Terinstall */}
        <Controller
          name="hardwareTerinstall"
          control={form.control}
          render={({ field, fieldState }) => {
            const { value, onChange } = field;

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Hardware Terinstall</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? `Nama: ${
                            listHardware.find((h: Hardware) => h.id === value)
                              ?.nama
                          }`
                        : "Pilih Hardware Terinstall"}
                      {" || "}
                      {value
                        ? `Nomor Seri: ${
                            listHardware.find((h: Hardware) => h.id === value)
                              ?.nomorSeri
                          }`
                        : "Pilih Hardware Terinstall"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command value={value || ""}>
                      <CommandInput
                        placeholder="Search Hardware..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          Tidak ada hardware ditemukan
                        </CommandEmpty>
                        <CommandGroup>
                          {listHardware.map((hardware: Hardware) => (
                            <CommandItem
                              key={hardware.id}
                              value={hardware.id}
                              onSelect={(currentValue) => {
                                onChange(
                                  currentValue === value ? null : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {hardware.nama} | {hardware.nomorSeri}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === hardware.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <div className="flex flex-col lg:flex-row  gap-4 justify-start">
          <Link href="/admin/manage-asset/opd-software">
            <Button type="button" className="cursor-pointer" disabled={loading}>
              Back
            </Button>
          </Link>
          <Button type="submit" className="cursor-pointer" disabled={loading}>
            Simpan
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
