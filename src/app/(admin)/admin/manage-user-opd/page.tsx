"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Plus,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useDelete, useGet } from "@/hooks/useApi";
import { useDebounce } from "use-debounce";
import { notifier } from "@/components/ToastNotifier";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

type User = {
  id: string;
  email: string | null;
  name: string | null;
  role: "OPD" | "ADMIN";
  opd?: {
    kode: string;
    nama: string;
  };
  createdAt: string;
};

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { del, loading } = useDelete();

  const endpoint = `/user-opd${
    debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : ""
  }`;

  const { data, error, isLoading, mutate } = useGet(endpoint);

  const handleDelete = (id: string) => async () => {
    try {
      await del(`/user-opd/${id}`);

      notifier.success("Berhasil", "User berhasil dihapus");

      await mutate("/user-opd/"); // Refresh SWR cache
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      notifier.error("Gagal Menghapus User OPD", error.response?.data?.message);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-lg md:text-3xl font-bold">Daftar User OPD</h1>
        <Link href="/admin/manage-user-opd/add">
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Tambah User
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center md:justify-start xl:justify-end mb-4">
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau kode OPD..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        className="rounded-xl border bg-card text-card-foreground shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode OPD</TableHead>
              <TableHead>Nama OPD</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Dibuat Pada</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING */}
            {isLoading &&
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse my-2"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* ERROR */}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="p-6 bg-red-100 border border-red-300 rounded-lg flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-700 font-medium">
                      Terjadi kesalahan saat memuat data.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* NO DATA */}
            {!isLoading && !error && (!data || data.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}

            {/* DATA */}
            {!isLoading &&
              !error &&
              data?.map((u: User, i: number) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="border-b transition-colors hover:bg-muted/40"
                >
                  <TableCell className="font-semibold">{u.opd?.kode}</TableCell>
                  <TableCell>{u.opd?.nama}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <Link href={`/admin/manage-user-opd/${u.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                        </Link>

                        <Link href={`/admin/manage-user-opd/${u.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 cursor-pointer"
                          onClick={handleDelete(u.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {loading ? "Menghapus..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
