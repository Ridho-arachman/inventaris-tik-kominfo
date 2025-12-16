import ListOpdComponent from "@/components/admin/ListOpd";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={<SuspenseFallback>Loading OPD data...</SuspenseFallback>}
    >
      <ListOpdComponent />
    </Suspense>
  );
}

export default Page;
