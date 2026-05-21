import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { PublicProfile } from "@/components/cards/PublicProfile";

export default async function ProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const card = await prisma.card.findUnique({
    where: { slug: params.slug },
  });

  if (!card || !card.isActive) {
    notFound();
  }

  // Record analytics asynchronously
  prisma.analytics.create({
    data: {
      cardId: card.id,
      eventType: "PAGE_VIEW",
    }
  }).catch(console.error);

  return (
    <div className="min-h-screen w-full bg-zinc-50 sm:bg-zinc-100 flex sm:p-8 justify-center items-center">
      <div className="w-full h-full min-h-screen sm:min-h-[850px] sm:w-[414px] sm:h-[896px] sm:rounded-[3rem] sm:border-[14px] border-zinc-900 bg-zinc-50 sm:shadow-2xl overflow-hidden relative">
        {/* Dynamic Island Mock for Desktop Preview */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-7 bg-zinc-900 rounded-b-3xl w-40 mx-auto z-50" />
        
        <PublicProfile card={card} />
      </div>
    </div>
  );
}
