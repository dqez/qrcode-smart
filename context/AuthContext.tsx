"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getRedirectResult
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

  // Hàm xử lý lưu user vào Firestore (Tách riêng để tái sử dụng)
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
    // 1. Lắng nghe trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // 2. Xử lý kết quả trả về nếu dùng signInWithRedirect (Cho Mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // Nếu đăng nhập thành công qua Redirect, lưu thông tin vào Firestore
          saveUserToFirestore(result.user);
        }
      })
      .catch((error) => {
        console.error("Error with redirect login:", error);
      });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Kiểm tra đơn giản xem có phải thiết bị mobile không
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Nếu là Mobile: Dùng Redirect để tránh lỗi chặn popup
        await signInWithRedirect(auth, googleProvider);
        // Lưu ý: Code phía sau dòng này sẽ KHÔNG chạy ngay lập tức vì trang web sẽ bị chuyển hướng.
        // Việc lưu Firestore sẽ được xử lý bởi getRedirectResult trong useEffect.
      } else {
        // Nếu là Desktop: Dùng Popup cho tiện
        const result = await signInWithPopup(auth, googleProvider);
        // Với Popup, code chạy tiếp tục ngay tại đây
        await saveUserToFirestore(result.user);
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
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
