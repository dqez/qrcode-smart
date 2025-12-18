"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function DomainManager() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [domains, setDomains] = useState<{ id: string; domain: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch domains on load
  useEffect(() => {
    if (!user) return;
    const fetchDomains = async () => {
      const q = query(collection(db, "domains"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      setDomains(snapshot.docs.map(d => ({ id: d.id, domain: d.data().domain })));
    };
    fetchDomains();
  }, [user]);

  const handleAdd = async () => {
    if (!input || !user) return;
    setLoading(true);
    try {
      // Simple domain validation
      const domain = input.replace(/^https?:\/\//, "").replace(/\/$/, "");

      const docRef = await addDoc(collection(db, "domains"), {
        domain,
        userId: user.uid,
        createdAt: new Date()
      });

      setDomains([...domains, { id: docRef.id, domain }]);
      setInput("");
    } catch (e) {
      console.error("Error adding domain", e);
      alert("Failed to add domain");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this domain?")) return;
    await deleteDoc(doc(db, "domains", id));
    setDomains(domains.filter(d => d.id !== id));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Allowed Domains</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. mywebsite.com"
          className="flex-1 rounded-md border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Domain"}
        </button>
      </div>

      <ul className="space-y-2">
        {domains.map((d) => (
          <li key={d.id} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md">
            <span className="text-neutral-700 dark:text-neutral-300">{d.domain}</span>
            <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700 text-sm">
              Remove
            </button>
          </li>
        ))}
        {domains.length === 0 && <p className="text-neutral-500 text-sm">No domains added yet.</p>}
      </ul>
    </div>
  );
}
