import { Spinner } from "./ui/spinner";

export function SuspenseFallback({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 gap-4 bg-background">
      <Spinner className="size-10" />
      {children && <p className="text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}
