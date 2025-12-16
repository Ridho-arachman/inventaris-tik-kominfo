import SoftwareOpdListComponent from "@/components/opd/ListSoftwareOpd";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={<SuspenseFallback>Loading software data...</SuspenseFallback>}
    >
      <SoftwareOpdListComponent />
    </Suspense>
  );
}

export default Page;
