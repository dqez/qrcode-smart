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
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
          credits: 5, // Default credits for new users
          tier: 'free',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        // Logic update cho user cũ chưa có credits hoặc tier
        const userData = userSnap.data();
        const updates: any = {
          lastLogin: serverTimestamp(),
        };

        if (userData && typeof userData.credits === 'undefined') {
          updates.credits = 5; // Tặng 5 credits cho user cũ
        }

        if (userData && !userData.tier) {
          updates.tier = 'free'; // Mặc định là free nếu chưa có tier
        }

        await setDoc(userRef, updates, { merge: true });
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  useEffect(() => {
    // 1. Lắng nghe trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to user profile changes
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      } else {
        // Fallback if document doesn't exist yet (rare race condition)
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user]);

  // 2. Xử lý kết quả trả về nếu dùng signInWithRedirect (Cho Mobile)
  useEffect(() => {
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
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, logout }}>
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
