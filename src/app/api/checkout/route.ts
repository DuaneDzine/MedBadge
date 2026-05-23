import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    // 1. Basic Auth Check (Prevents Unauthenticated Spam / DoW Attacks)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 });
    }

    // TODO: When FIREBASE_SERVICE_ACCOUNT_KEY is added to production, verify the token via admin SDK:
    // const idToken = authHeader.split('Bearer ')[1];
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // if (decodedToken.uid !== userId) throw new Error('Unauthorized');

    const { priceId, userId, tier } = await req.json();

    if (!userId || !priceId) {
      return NextResponse.json({ error: 'Bad Request: Missing userId or priceId' }, { status: 400 });
    }

    // 2. Create Checkout Sessions for Pilot Phase
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?checkout=success`,
      cancel_url: `${req.headers.get('origin')}/dashboard?checkout=canceled`,
      client_reference_id: userId,
      metadata: {
        userId,
        tier
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
