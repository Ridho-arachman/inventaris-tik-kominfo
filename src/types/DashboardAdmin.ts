// Summary
export type Summary = {
  totalOpd: number;
  totalUsers: number;
  totalHardware: number;
  totalSoftware: number;
};

// Status hardware per keseluruhan
export type AssetHardwareStatus = {
  name: "Aktif" | "Non Aktif";
  aktifHardware?: number;
  nonAktifHardware?: number;
};

// Status software per keseluruhan
export type AssetSoftwareStatus = {
  name: "Aktif" | "Non Aktif";
  aktifSoftware?: number;
  nonAktifSoftware?: number;
};

// Hardware / Software per OPD
export type AssetDetail = {
  total: number;
  aktif: number;
  nonAktif: number;
};

// Asset per OPD
export type AssetPerOpd = {
  id: string;
  name: string;
  totalAssets: number;
  aktif: number;
  nonAktif: number;
  hardware: AssetDetail;
  software: AssetDetail;
};

// Pertumbuhan asset per bulan
export type AssetGrowth = {
  label: string; // contoh: "Jan", "Feb", dll
  total: number;
};

// Response final
export type AdminDashboardData = {
  summary: Summary;
  assetHardwareStatus: AssetHardwareStatus[];
  assetSoftwareStatus: AssetSoftwareStatus[];
  assetsPerOpd: AssetPerOpd[];
  assetGrowth: AssetGrowth[];
};
