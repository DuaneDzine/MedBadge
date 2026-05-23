import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

export async function POST(req: Request) {
  // Lazy initialize Stripe to prevent build-time errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
    apiVersion: '2026-04-22.dahlia',
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'dummy_secret';

  // Lazy initialize Firebase Admin to prevent build-time errors
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'dummy@email.com',
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '-----BEGIN PRIVATE KEY-----\ndummy\n-----END PRIVATE KEY-----',
        }),
      });
    } catch (e) {
      console.warn("Firebase Admin Initialization Warning:", e);
    }
  }
  
  const db = admin.firestore();

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      
      if (userId) {
        // Upgrade the user to the Pro tier in Firestore
        await db.collection('users').doc(userId).update({
          tier: 'pro',
          stripeCustomerId: session.customer,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ User ${userId} upgraded to Pro tier.`);
      } else {
        console.error('⚠️  No userId found in session metadata.');
      }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error: any) {
    console.error('❌ Webhook handler failed:', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
