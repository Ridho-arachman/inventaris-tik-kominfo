import KategoriHardwareListComponent from "@/components/admin/ListKategoriHardwareAdmin";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={
        <SuspenseFallback>Loading kategori hardware data...</SuspenseFallback>
      }
    >
      <KategoriHardwareListComponent />
    </Suspense>
  );
}

export default Page;
