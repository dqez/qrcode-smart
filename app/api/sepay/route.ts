import { dbAdmin } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import * as admin from 'firebase-admin';

const PLANS = {
  '2000': { id: 'pro', credits: 100 },
  '3000': { id: 'enterprise', credits: 500 },
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('Authorization');
    if (apiKey !== `Apikey ${process.env.SEPAY_API_KEY}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, transferAmount, content, transferType } = body;

    if (transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Ignored transfer out' });
    }

    const transactionRef = dbAdmin.collection('transactions').doc(String(id));
    const transactionDoc = await transactionRef.get();

    if (transactionDoc.exists) {
      return NextResponse.json({ success: true, message: 'Transaction already processed' });
    }


    const match = content.match(/SEVQR\s+([a-zA-Z0-9]+)/i);
    if (!match) {
      await transactionRef.set({ ...body, status: 'failed_no_user_id', createdAt: new Date() });
      return NextResponse.json({ success: true, message: 'No user ID found in content' });
    }

    const userId = match[1];
    const amountStr = String(transferAmount);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const planInfo = PLANS[amountStr];

    if (!planInfo) {
      await transactionRef.set({ ...body, userId, status: 'failed_wrong_amount', createdAt: new Date() });
      return NextResponse.json({ success: true, message: 'Amount does not match any plan' });
    }

    await dbAdmin.runTransaction(async (t) => {
      const userRef = dbAdmin.collection('users').doc(userId);
      const userDoc = await t.get(userRef);

      if (!userDoc.exists) {
        throw new Error('User does not exist');
      }

      // Calculate expiration date (30 days from now)
      const now = new Date();
      const expiresAt = new Date(now.setDate(now.getDate() + 30));

      // Update User Tier & Add Credits
      t.update(userRef, {
        tier: planInfo.id,
        credits: admin.firestore.FieldValue.increment(planInfo.credits),
        tierExpiresAt: expiresAt,
        updatedAt: new Date()
      });

      // Lưu lịch sử giao dịch
      t.set(transactionRef, {
        ...body,
        userId,
        plan: planInfo.id,
        creditsAdded: planInfo.credits,
        status: 'completed',
        processedAt: new Date()
      });
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}