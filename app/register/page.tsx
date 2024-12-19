"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import Logo from "@/app/components/Logo";
import { toast } from "react-hot-toast";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: name });

      // 將用戶資料存儲到 Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });

      await sendEmailVerification(user, {
        url: window.location.origin + "/login",
        handleCodeInApp: false,
      });

      toast.success("註冊成功！請查看您的電子郵件以完成驗證。", {
        duration: 5000,
        style: {
          background: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #34D399",
        },
      });
      await signOut(auth);
      router.push("/login");
    } catch (error: any) {
      toast.error("註冊失敗：" + error.message, {
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #F87171",
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Logo 區域 - 固定在左上角 */}
      <div className="fixed top-6 left-6 z-50">
        <Logo />
      </div>

      {/* 左側圖片區 */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/cooking-background-2.jpg"
          alt="美食背景"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center max-w-md p-8">
            <h2 className="text-4xl font-display font-bold mb-4">
              開始您的美食之旅
            </h2>
            <p className="text-lg">創建帳號，與美食愛好者一起分享烹飪樂趣</p>
          </div>
        </div>
      </div>

      {/* 右側註冊表單 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* 手機版返回按鈕 */}
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回首頁
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              創建新帳號
            </h2>
            <p className="text-gray-600 mt-2">加入我們的美食社群</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="您的名字"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電子郵件
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密碼
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                註冊
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#fff5f1] text-gray-500">或</span>
              </div>
            </div>

            <GoogleSignInButton />

            <div className="text-center">
              <Link
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                已有帳號？立即登入
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
