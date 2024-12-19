"use client";

import { useSearchParams } from "next/navigation";
import ChatRoom from "@/app/components/ChatRoom";
import ChatList from "@/app/components/ChatList";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const recipeId = searchParams.get("recipeId");
  const [showMobileList, setShowMobileList] = useState(false);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-orange-50 to-white min-h-screen">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon
              icon={faComments}
              className="w-10 h-10 text-orange-500"
            />
          </div>
          <h2 className="text-3xl font-display font-semibold text-gray-900 mb-3">
            加入聊天
          </h2>
          <p className="text-gray-600 mb-8">登入即可參與美食討論</p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all inline-block font-medium shadow-lg hover:shadow-xl"
          >
            立即登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-screen bg-gradient-to-b from-orange-100 to-white overflow-hidden">
      <div className="h-full w-full max-w-8xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 h-full w-full flex flex-col md:flex-row">
          {!chatId && !recipeId && (
            <div className="md:hidden p-4 border-b border-gray-100">
              <button
                onClick={() => setShowMobileList(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl"
              >
                查看聊天室列表
              </button>
            </div>
          )}

          {showMobileList && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">
              <div className="bg-white h-full w-full max-w-md mx-auto flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">聊天室列表</h2>
                  <button onClick={() => setShowMobileList(false)}>
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ChatList currentChatId={chatId || recipeId} />
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:block md:w-80 flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-gray-100 rounded-l-3xl">
            <ChatList currentChatId={chatId || recipeId} />
          </div>

          <div className="flex-1 flex min-h-0 rounded-r-3xl overflow-hidden">
            {chatId || recipeId ? (
              <ChatRoom
                recipeId={recipeId || chatId || undefined}
                isFullScreen={true}
                onMobileListChange={setShowMobileList}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center px-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon
                      icon={faComments}
                      className="w-12 h-12 text-orange-500"
                    />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
                    開始聊天
                  </h3>
                  <p className="text-gray-600">選擇一個聊天室或建立新的對話</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
