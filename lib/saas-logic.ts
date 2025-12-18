import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Checks if the referer/origin domain is allowed by querying Firestore.
 * @param refererOrOrigin The Referer or Origin header string.
 * @returns true if allowed, false otherwise.
 */
export async function checkDomainAllowed(refererOrOrigin: string | null): Promise<boolean> {
  console.log("--- Domain Check Debug ---");
  console.log("Incoming Referer/Origin:", refererOrOrigin);

  if (!refererOrOrigin) {
    console.log("Denied: No Referer/Origin");
    return false;
  }

  try {
    // 1. Extract Hostname (e.g., "https://abc.com/page" -> "abc.com")
    const url = new URL(refererOrOrigin);
    const hostWithPort = url.host; // e.g. 127.0.0.1:5500
    const hostnameOnly = url.hostname; // e.g. 127.0.0.1

    console.log("Parsed HostWithPort:", hostWithPort);
    console.log("Parsed HostnameOnly:", hostnameOnly);

    // 2. Query Firestore
    const domainsRef = collection(db, "domains");

    // Check 1: Exact match (with port)
    const q1 = query(domainsRef, where("domain", "==", hostWithPort));
    const snapshot1 = await getDocs(q1);
    console.log("Check 1 (Exact) found:", !snapshot1.empty);
    if (!snapshot1.empty) return true;

    // Check 2: Hostname match (without port) - Allow any port
    const q2 = query(domainsRef, where("domain", "==", hostnameOnly));
    const snapshot2 = await getDocs(q2);
    console.log("Check 2 (Hostname) found:", !snapshot2.empty);
    return !snapshot2.empty;
  } catch (error) {
    console.error("Error checking domain:", error);
    return false;
  }
}
