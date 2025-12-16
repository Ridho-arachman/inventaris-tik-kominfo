import KategoriSoftwareListComponent from "@/components/admin/ListKategoriSoftwareAdmin";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={
        <SuspenseFallback>Loading kategori software data...</SuspenseFallback>
      }
    >
      <KategoriSoftwareListComponent />
    </Suspense>
  );
}

export default Page;
