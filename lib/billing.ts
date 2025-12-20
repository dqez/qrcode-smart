import { db } from "@/lib/firebase";
import { doc, runTransaction, increment, updateDoc, Timestamp } from "firebase/firestore";

/**
 * Adds credits to a user's account.
 * @param userId The user's ID.
 * @param amount The amount of credits to add.
 */
export async function addCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    credits: increment(amount)
  });
}

/**
 * Upgrades the user's tier and adds credits.
 * @param userId The user's ID.
 * @param tier The new tier ('pro' | 'enterprise').
 * @param creditsToAdd The amount of credits to add.
 */
export async function upgradeTier(userId: string, tier: 'pro' | 'enterprise', creditsToAdd: number): Promise<void> {
  const userRef = doc(db, "users", userId);

  // Calculate expiration date (30 days from now)
  const now = new Date();
  const expiresAt = new Date(now.setDate(now.getDate() + 30));

  await updateDoc(userRef, {
    tier: tier,
    credits: increment(creditsToAdd),
    tierExpiresAt: Timestamp.fromDate(expiresAt)
  });
}

/**
 * Checks if the user has enough credits and deducts them if so.
 * @param userId The user's ID.
 * @param cost The cost in credits.
 * @returns true if successful, false if insufficient funds.
 */
export async function checkAndDeductCredits(userId: string, cost: number): Promise<boolean> {
  const userRef = doc(db, "users", userId);

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw "User does not exist!";
      }

      const currentCredits = userDoc.data().credits || 0;
      if (currentCredits < cost) {
        throw "Insufficient credits";
      }

      transaction.update(userRef, {
        credits: currentCredits - cost
      });
    });
    return true;
  } catch (e) {
    console.error("Transaction failed: ", e);
    return false;
  }
}
