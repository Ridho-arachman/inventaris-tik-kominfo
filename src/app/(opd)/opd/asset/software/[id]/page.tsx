"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDelete, useGet } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

export default function SoftwareDetailPage() {
  const { id } = useParams();

  const { data: software, error, isLoading } = useGet(`/software/${id}`);
  const { del, loading } = useDelete();

  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await del(`/software/${id}`);
      notifier.success(
        "Berhasil",
        `Software ${res.data.nama} berhasil dihapus`
      );
      router.push("/admin/manage-asset/opd-software");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error("Gagal Menghapus Software", err.response?.data.message);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );

  if (error) {
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <h2 className="text-lg font-semibold">Terjadi Kesalahan</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Gagal memuat data software"}
      </p>
      <Link href="/admin/manage-asset/opd-software">
        <Button variant="outline">Kembali</Button>
      </Link>
    </div>;
  }

  if (!software) {
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <h2 className="text-lg font-semibold">Data Tidak Ditemukan</h2>
      <p className="text-sm text-muted-foreground">
        Software yang Anda cari tidak tersedia
      </p>
      <Link href="/admin/manage-asset/opd-software">
        <Button variant="outline">Kembali</Button>
      </Link>
    </div>;
  }

  return (
    <div className="space-y-6">
      Header
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{software.nama}</h1>
          <p className="text-sm text-muted-foreground">Detail aset software</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Kembali */}
          <Link href="/admin/manage-asset/opd-software">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali
            </Button>
          </Link>

          {/* Edit */}
          <Link href={`/admin/manage-asset/opd-software/${id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={loading}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>

          {/* Hapus */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                disabled={loading}
              >
                <Trash className="w-4 h-4 mr-1" />
                Hapus
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Software?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data software akan
                  dipindahkan ke arsip (soft delete).
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(software.id)}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* Informasi Utama */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Utama</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="Nama Software" value={software.nama} />
          <Detail label="Versi Terpasang" value={software.versiTerpasang} />
          <Detail label="Vendor" value={software.vendor || "—"} />
          <Detail label="In House" value={software.inHouse ? "Ya" : "Tidak"} />
          <Detail
            label="Status"
            value={
              <Badge
                className={
                  software.status === "AKTIF"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {software.status}
              </Badge>
            }
          />
          <Detail label="PIC" value={software.pic} />
        </CardContent>
      </Card>
      {/* Lisensi */}
      <Card>
        <CardHeader>
          <CardTitle>Lisensi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail
            label="Jenis Lisensi"
            value={<Badge>{software.jenisLisensi}</Badge>}
          />
          <Detail label="Nomor Seri" value={software.nomorSeri || "—"} />
          <Detail
            label="Tanggal Berakhir Lisensi"
            value={
              software.tglBerakhirLisensi ? software.tglBerakhirLisensi : "—"
            }
          />
          <Detail
            label="Kritikalitas"
            value={
              <Badge
                variant={
                  software.kritikalitas === "TINGGI" ? "destructive" : "default"
                }
              >
                {software.kritikalitas}
              </Badge>
            }
          />
        </CardContent>
      </Card>
      {/* Pengadaan */}
      <Card>
        <CardHeader>
          <CardTitle>Pengadaan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail
            label="Tanggal Pengadaan"
            value={new Date(software.tglPengadaan).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <Detail
            label="Harga Perolehan"
            value={new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(software.hargaPerolehan)}
          />
        </CardContent>
      </Card>
      {/* Relasi */}
      <Card>
        <CardHeader>
          <CardTitle>Relasi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="OPD" value={software.opd.nama} />
          <Detail
            label="Kategori Software"
            value={software.kategoriSoftware.nama}
          />
          <Detail
            label="Hardware Terinstall"
            value={software.hardware?.nama || "—"}
          />
        </CardContent>
      </Card>
      {/* Audit */}
      <Card>
        <CardHeader>
          <CardTitle>Audit</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="Dibuat Oleh" value={software.creator.name} />
          <Detail
            label="Tanggal Dibuat"
            value={new Date(software.createdAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <Detail label="Diupdate Oleh" value={software.updater.name} />
          <Detail
            label="Tanggal Update"
            value={new Date(software.updatedAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* Komponen kecil biar rapi */
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
