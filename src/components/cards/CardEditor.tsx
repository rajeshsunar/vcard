"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LivePreview } from "@/components/cards/LivePreview";
import { createCard, updateCard } from "@/actions/cards";
import { useRouter } from "next/navigation";

export function CardEditor({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: initialData || {
      slug: "",
      title: "My Business Card",
      name: "",
      jobTitle: "",
      company: "",
      bio: "",
      theme: "default",
      colorHex: "#000000"
    }
  });

  const formData = form.watch();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateCard(initialData.id, data);
      } else {
        await createCard(data);
      }
      router.push("/cards");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Editor Side */}
      <div className="flex-1 bg-white p-6 rounded-xl border shadow-sm h-fit">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Card Details</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Internal Title (e.g., Work, Personal)</Label>
              <Input id="title" {...form.register("title")} placeholder="Work Card" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Public URL (vcard.app/u/...)</Label>
              <Input id="slug" {...form.register("slug")} placeholder="john-doe" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" {...form.register("jobTitle")} placeholder="Software Engineer" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} placeholder="Acme Corp" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register("bio")} placeholder="Write a short bio..." />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="colorHex">Brand Color</Label>
              <div className="flex gap-2">
                 <Input type="color" id="colorHex" {...form.register("colorHex")} className="w-16 h-10 p-1 cursor-pointer rounded-md" />
                 <Input type="text" {...form.register("colorHex")} className="flex-1" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Save Changes" : "Create Card"}
          </Button>
        </form>
      </div>

      {/* Preview Side */}
      <div className="w-full lg:w-[400px] flex justify-center sticky top-8 h-fit">
        <LivePreview data={formData} />
      </div>
    </div>
  );
}
