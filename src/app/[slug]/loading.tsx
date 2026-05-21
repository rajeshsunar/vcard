import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
        <p className="text-sm font-medium">Loading Profile...</p>
      </div>
    </div>
  );
}
