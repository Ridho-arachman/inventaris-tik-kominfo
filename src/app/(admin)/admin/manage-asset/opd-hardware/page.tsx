import HardwareListComponent from "@/components/admin/ListHardwareAdmin";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={<SuspenseFallback>Loading hardware data...</SuspenseFallback>}
    >
      <HardwareListComponent />
    </Suspense>
  );
}

export default Page;
