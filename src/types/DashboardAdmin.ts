type Summary = {
  totalOpd: number;
  totalUsers: number;
  totalHardware: number;
  totalSoftware: number;
};

type StatusItem = {
  name: "Aktif" | "Non Aktif";
  count: number;
};

type AssetPerOpd = {
  id: string;
  name: string;
  totalAssets: number;
  hardware: {
    total: number;
    aktif: number;
    nonAktif: number;
  };
  software: {
    total: number;
    aktif: number;
    nonAktif: number;
  };
};

type AssetGrowthItem = {
  label: string;
  total: number;
};

export type DashboardResponse = {
  summary: Summary;
  assetHardwareStatus: StatusItem[];
  assetSoftwareStatus: StatusItem[];
  assetsPerOpd: AssetPerOpd[];
  assetGrowth: AssetGrowthItem[];
};
