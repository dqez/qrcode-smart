import { dbAdmin } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Xác thực User qua ID Token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    // Verify token để lấy uid an toàn
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await req.json();
    const { content, base64, qrOptions, name } = body;

    // 2. Chạy Transaction: Check Credits -> Trừ Credits -> Lưu QR
    const result = await dbAdmin.runTransaction(async (t) => {
      const userRef = dbAdmin.collection('users').doc(userId);
      const userDoc = await t.get(userRef);

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentCredits = userData?.credits || 0;

      // Kiểm tra đủ tiền không
      if (currentCredits < 1) {
        throw new Error("Insufficient credits");
      }

      // Trừ 1 credit
      t.update(userRef, {
        credits: currentCredits - 1
      });

      // Tạo QR Code document
      const qrRef = dbAdmin.collection('qrcodes').doc();
      t.set(qrRef, {
        userId,
        content,
        base64,
        createdAt: new Date(),
        viewCount: 0,
        status: 'active',
        name,
        qrOptions
      });

      return { id: qrRef.id };
    });

    return NextResponse.json({ success: true, id: result.id });

  } catch (error: any) {
    console.error("Save QR Error:", error);
    if (error.message === "Insufficient credits") {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}