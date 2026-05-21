import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-[350px] w-full rounded-xl" />
    </div>
  );
}
