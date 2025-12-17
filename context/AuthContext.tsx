"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithRedirect, // Chỉ dùng cái này
  signOut,
  onAuthStateChanged,
  getRedirectResult // Hàm quan trọng để bắt kết quả sau khi redirect
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm xử lý lưu user vào Firestore
  const saveUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  useEffect(() => {
    // 1. Xử lý kết quả trả về sau khi Redirect (Lưu vào DB ở đây)
    // Hàm này chỉ chạy 1 lần khi trang web load lại sau khi đăng nhập thành công
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Redirect login successful");
          saveUserToFirestore(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect login error:", error);
      });

    // 2. Lắng nghe trạng thái đăng nhập (Cập nhật UI state ở đây)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Đơn giản hóa: Luôn dùng Redirect cho mọi thiết bị
      await signInWithRedirect(auth, googleProvider);

      // LƯU Ý QUAN TRỌNG:
      // Không viết code xử lý db hay console.log ở đây.
      // Vì trình duyệt sẽ chuyển hướng ngay lập tức, code phía dưới sẽ không kịp chạy.
      // Mọi logic xử lý sau đăng nhập phải nằm trong getRedirectResult ở useEffect trên.
    } catch (error) {
      console.error("Error initiating google sign in", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
