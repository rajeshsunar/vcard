import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Contact, Card as PrismaCard } from "@prisma/client";

export default async function ContactsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const contacts = await prisma.contact.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      sourceCard: {
        select: { title: true, slug: true }
      }
    }
  }) as (Contact & { sourceCard: { title: string; slug: string } | null })[];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Captured Contacts</h2>
        <p className="text-muted-foreground">
          People who shared their info through your digital cards.
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-zinc-300">
          <h3 className="text-xl font-semibold mb-2">No contacts yet</h3>
          <p className="text-zinc-500 mb-6 text-center max-w-sm">
            When people fill out the "Exchange Info" form on your public profiles, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact: Contact & { sourceCard: { title: string; slug: string } | null }) => (
            <Card key={contact.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{contact.name}</span>
                  <span className="text-xs text-zinc-400 font-normal">
                    {formatDistanceToNow(contact.createdAt, { addSuffix: true })}
                  </span>
                </CardTitle>
                {contact.sourceCard && (
                  <p className="text-xs text-zinc-500 font-medium">
                    From card: {contact.sourceCard.title}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.email && (
                  <div className="flex items-center text-sm text-zinc-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center text-sm text-zinc-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center text-sm text-zinc-600">
                    <Building className="w-4 h-4 mr-2" />
                    {contact.company}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
