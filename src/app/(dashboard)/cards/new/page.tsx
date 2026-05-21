import { CardEditor } from "@/components/cards/CardEditor";

export default function NewCardPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Create New Card</h2>
        <p className="text-muted-foreground">
          Design your digital business card and customize your public profile.
        </p>
      </div>
      <CardEditor />
    </div>
  );
}
