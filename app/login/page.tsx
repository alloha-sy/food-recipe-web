"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import Logo from "@/app/components/Logo";
import { toast } from "react-hot-toast";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Login() {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        toast.error("請先驗證您的電子郵件後再登入", {
          style: {
            background: "#FEE2E2",
            color: "#991B1B",
            border: "1px solid #F87171",
          },
        });
        await signOut(auth);
        return;
      }

      // 更新用戶的 emailVerified 狀態
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        emailVerified: true,
        lastLoginAt: Date.now(),
      });

      toast.success("登入成功！", {
        style: {
          background: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #34D399",
        },
      });
      router.push("/");
    } catch (error: any) {
      toast.error("登入失敗：" + error.message, {
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
          src="/cooking-background.jpg"
          alt="美食背景"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center max-w-md p-8">
            <h2 className="text-4xl font-display font-bold mb-4">
              探索美食的無限可能
            </h2>
            <p className="text-lg">加入我們的美食社群，分享您的烹飪故事</p>
          </div>
        </div>
      </div>

      {/* 右側登入表單 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              歡迎回來
            </h2>
            <p className="text-gray-600 mt-2">登入您的帳號，開始分享美食</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                登入
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
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                還沒有帳號？立即註冊
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
