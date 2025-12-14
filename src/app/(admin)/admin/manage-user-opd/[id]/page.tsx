"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useGet } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: user, error, isLoading } = useGet(`/user-opd/${id}`);

  if (isLoading)
    return (
      <div className="px-10 mb-10 space-y-4" key="loading-skeleton">
        {/* Header skeleton */}
        <div className="h-10 w-1/3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>

        <Separator className="my-6" />

        {/* Sections skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}

        {/* Action buttons skeleton */}
        <div className="flex justify-end gap-3 mt-10">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="w-1/2 mx-auto mt-20 p-6 border rounded-lg shadow-md bg-red-50 flex items-center justify-center gap-4"
        key="error-alert"
      >
        <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
        <div className="flex flex-col justify-center items-center gap-1">
          <h2 className="font-semibold text-red-800 text-lg">
            Pengguna tidak ditemukan
          </h2>
          <p className="text-red-700 text-sm">
            Maaf, data pengguna yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => router.back()} className="cursor-pointer mt-2">
            Kembali
          </Button>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-10"
      key="user-detail-container"
    >
      {/* HEADER */}
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Detail Pengguna
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl">
          Informasi lengkap pengguna OPD, termasuk identitas dan aktivitas.
        </p>
      </div>

      <Separator className="my-6" />

      {/* CONTENT */}
      <div className="space-y-12">
        <Section title="Informasi Utama">
          <Detail label="ID" value={user.id} />
          <Detail label="Email" value={user.email ?? "-"} />
          <Detail label="Nama Lengkap" value={user.name ?? "-"} />
        </Section>

        <Section title="Peran & Kode OPD">
          <Detail label="Role" value={user.role} />
          <Detail label="Kode OPD" value={user.opd?.kode ?? "-"} />
          <Detail label="Nama OPD" value={user.opd?.nama ?? "-"} />
        </Section>

        <Section title="Waktu Aktivitas">
          <Detail
            label="Dibuat Pada"
            value={new Date(user.createdAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <Detail
            label="Diperbarui Pada"
            value={
              user.updatedAt
                ? new Date(user.updatedAt).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "-"
            }
          />
        </Section>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-10">
        <Link href="/admin/manage-user-opd">
          <Button className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>

        <Link href={`/admin/manage-user-opd/${user.id}/edit`}>
          <Button className="cursor-pointer">
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4" key={title}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div key={label}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  );
}
