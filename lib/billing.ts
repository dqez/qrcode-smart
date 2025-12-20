import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";

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
