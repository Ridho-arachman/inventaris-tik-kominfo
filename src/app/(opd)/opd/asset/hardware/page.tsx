import HardwareOpdListComponent from "@/components/opd/ListHardwareOpd";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={<SuspenseFallback>Loading hardware data...</SuspenseFallback>}
    >
      <HardwareOpdListComponent />
    </Suspense>
  );
}

export default Page;
