import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default async function CardsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cards = await prisma.card.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Cards</h2>
          <p className="text-muted-foreground">
            Manage your digital business cards.
          </p>
        </div>
        <Link href="/cards/new">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-zinc-300">
          <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
          <p className="text-zinc-500 mb-6 text-center max-w-sm">
            You haven't created any digital business cards yet. Click the button below to get started.
          </p>
          <Link href="/cards/new">
            <Button>Create your first card</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">vcard.app/u/{card.slug}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/${card.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" /> View
                  </Button>
                </Link>
                <Link href={`/cards/${card.id}`}>
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
