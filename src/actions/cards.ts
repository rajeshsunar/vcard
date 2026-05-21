"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCard(data: any) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Ensure slug is unique
  const existing = await prisma.card.findUnique({
    where: { slug: data.slug }
  });

  if (existing) {
    throw new Error("Slug is already taken");
  }

  const card = await prisma.card.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/cards");
  revalidatePath("/dashboard");
  
  return card;
}

export async function updateCard(cardId: string, data: any) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const card = await prisma.card.findUnique({
    where: { id: cardId }
  });

  if (!card || card.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }

  if (data.slug && data.slug !== card.slug) {
    const existing = await prisma.card.findUnique({
      where: { slug: data.slug }
    });
    if (existing) {
      throw new Error("Slug is already taken");
    }
  }

  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data,
  });

  revalidatePath("/cards");
  revalidatePath(`/cards/${cardId}`);
  revalidatePath(`/${updatedCard.slug}`);
  
  return updatedCard;
}

export async function deleteCard(cardId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.card.delete({
    where: {
      id: cardId,
      userId: userId,
    }
  });

  revalidatePath("/cards");
  revalidatePath("/dashboard");
}
