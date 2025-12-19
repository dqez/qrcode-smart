"use client";

import { useEffect, useRef } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ViewTracker({ qrId }: { qrId?: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!qrId || hasTracked.current) return;

    const trackView = async () => {
      try {
        const qrRef = doc(db, "qrcodes", qrId);
        await updateDoc(qrRef, {
          viewCount: increment(1)
        });
        hasTracked.current = true;
        console.log("View tracked for QR:", qrId);
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    trackView();
  }, [qrId]);

  return null;
}
