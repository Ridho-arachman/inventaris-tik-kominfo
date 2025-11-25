"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Dummy data asset OPD
const initialAssets = [
  {
    id: 1,
    name: "Laptop HP",
    brand: "HP",
    model: "Probook 440 G8",
    location: "Ruang Administrasi",
    jml: 10,
    jmlhAktif: 8,
    jmlhNonaktif: 2,
  },
  {
    id: 2,
    name: "Proyektor Epson",
    brand: "Epson",
    model: "Pro 1000",
    location: "Ruang Aula",
    jml: 8,
    jmlhAktif: 5,
    jmlhNonaktif: 3,
  },
];

export default function OPDAssetListPage() {
  const [assets, setAssets] = useState(initialAssets);
  const [showAdd, setShowAdd] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");

  const handleAddAsset = () => {
    if (!newAssetName) return;
    const newAsset = {
      id: assets.length + 1,
      name: newAssetName,
      brand: "Unknown",
      model: "Unknown",
      location: "Unknown",
      jml: 1,
      jmlhAktif: 1,
      jmlhNonaktif: 0,
    };
    setAssets([...assets, newAsset]);
    setNewAssetName("");
    setShowAdd(false);
  };

  const handleDeleteAsset = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus asset ini?")) {
      setAssets(assets.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Daftar Asset OPD
      </motion.h1>

      <div className="mb-6">
        <Button onClick={() => setShowAdd(true)}>Tambah Asset</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, idx) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{asset.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Brand: {asset.brand}</p>
                <p>Model: {asset.model}</p>
                <p>Lokasi: {asset.location}</p>
                <div className="flex justify-between">
                  <p>Jumlah:</p>
                  <p>{asset.jml}</p>
                </div>
                <div className="flex justify-between">
                  <p>Aktif:</p>
                  <Badge className="bg-green-100 text-green-700">
                    {asset.jmlhAktif}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <p>Non Aktif:</p>
                  <Badge className="bg-red-100 text-red-700">
                    {asset.jmlhNonaktif}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => alert("Edit asset dummy")}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal Tambah Asset */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Asset Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nama Asset"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Batal
            </Button>
            <Button onClick={handleAddAsset}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
