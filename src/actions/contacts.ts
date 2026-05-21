"use server";

import prisma from "@/lib/db";

export async function saveContact(data: any, ownerId: string, sourceCardId: string) {
  try {
    const contact = await prisma.contact.create({
      data: {
        ownerId,
        sourceCardId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        notes: data.notes,
      }
    });

    // We can also trigger an email to the card owner here in the future
    return { success: true, contact };
  } catch (error) {
    console.error("Error saving contact:", error);
    return { success: false, error: "Failed to save contact" };
  }
}
