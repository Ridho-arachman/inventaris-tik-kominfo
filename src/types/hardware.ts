export type Hardware = {
  id: string;
  nama: string;
  merk: string;

  // relasi kategori
  kategoriId: string;
  kategoriHardware?: {
    id: string;
    nama: string;
  };

  // relasi opd
  opdId: string;
  opd?: {
    id: string;
    nama: string;
  };

  lokasiFisik: string;
  tglPengadaan: string;
  garansiMulai: string;
  garansiSelesai: string;

  pic: string;
  status: "AKTIF" | "TIDAK_AKTIF";

  biayaPerolehan: number;
  nomorSeri: string;
  sumber: string;
};
