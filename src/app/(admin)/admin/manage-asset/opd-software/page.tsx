import SoftwareListComponent from "@/components/admin/ListSoftwareAdmin";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={<SuspenseFallback>Loading software data...</SuspenseFallback>}
    >
      <SoftwareListComponent />
    </Suspense>
  );
}

export default Page;
