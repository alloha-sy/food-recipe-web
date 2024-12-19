"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function GoogleSignInButton() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 將 Google 用戶資料存儲到 Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime,
          lastLoginAt: Date.now(),
        },
        { merge: true }
      );

      toast.success("登入成功！");
      router.push("/");
    } catch (error: any) {
      console.error("Google 登入失敗:", error);
      toast.error("Google 登入失敗，請稍後再試");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
    >
      <Image
        src="/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span>使用 Google 帳號登入</span>
    </button>
  );
}
