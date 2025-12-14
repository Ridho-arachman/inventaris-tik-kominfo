"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useGet } from "@/hooks/useApi";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams(); // ambil :id dari URL
  const { data: user, error, isLoading } = useGet(`/user-opd/${id}`);

  if (isLoading)
    return <p className="p-10 text-muted-foreground">Memuat data...</p>;

  if (error || !user)
    return (
      <p className="p-10 text-red-600">
        Terjadi kesalahan atau data tidak ditemukan.
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-10"
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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  );
}
