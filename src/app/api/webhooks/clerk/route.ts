import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    const primaryEmail = email_addresses.find(
      (email: any) => email.id === evt.data.primary_email_address_id
    )?.email_address;

    if (!primaryEmail) return new Response('No primary email', { status: 400 });

    try {
      await prisma.user.upsert({
        where: { id: id },
        update: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
        },
        create: {
          id: id as string,
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
        },
      });
    } catch (error) {
      console.error('Database Error:', error);
      return new Response('Database Error', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { id: evt.data.id },
      });
    } catch (error) {
      console.error('Database Error:', error);
    }
  }

  return new Response('', { status: 200 })
}
