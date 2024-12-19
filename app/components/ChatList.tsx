"use client";

import { useState, useEffect } from "react";
import { rtdb } from "@/app/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface ChatListProps {
  currentChatId?: string | null;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function ChatList({ currentChatId }: ChatListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const chatsRef = ref(rtdb, "chats");
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatList = Object.entries(data).map(
          ([id, chat]: [string, any]) => ({
            id,
            ...chat,
          })
        );
        setChats(chatList);
      }
    });
  }, [user]);

  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChat = async () => {
    if (!user || !newChatTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      const chatsRef = ref(rtdb, "chats");
      const newChatRef = push(chatsRef);

      await set(newChatRef, {
        title: newChatTitle.trim(),
        createdBy: user.uid,
        createdAt: Date.now(),
        members: {
          [user.uid]: {
            email: userData?.email || user.email,
            displayName: userData?.displayName || user.displayName,
            photoURL: userData?.photoURL || user.photoURL,
            joinedAt: Date.now(),
          },
        },
      });

      setShowNewChatModal(false);
      setNewChatTitle("");
      router.push(`/chat?id=${newChatRef.key}`);
    } catch (error) {
      console.error("創建聊天室失敗:", error);
      toast.error("創建聊天室失敗，請稍後再試");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 sticky top-0 z-10 bg-white">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="搜尋聊天室..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
        </div>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>新增聊天室</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <FontAwesomeIcon icon={faComments} className="w-8 h-8 mb-2" />
            <p className="text-center">尚無聊天室</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat?id=${chat.id}`}
                className={`block px-4 py-3 rounded-xl transition-all ${
                  currentChatId === chat.id
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium mb-1">
                  {chat.title || "未命名聊天室"}
                </div>
                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <span className="truncate max-w-[180px]">
                    {chat.lastMessage ? (
                      <>
                        <span className="font-medium">
                          {chat.lastMessage.userName}:{" "}
                        </span>
                        {chat.lastMessage.text}
                      </>
                    ) : (
                      "尚無訊息"
                    )}
                  </span>
                  {chat.lastMessage && (
                    <span className="text-xs flex-shrink-0 ml-2">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              新增聊天室
            </h3>
            <input
              type="text"
              placeholder="輸入聊天室名稱..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatTitle("");
                }}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCreateChat}
                disabled={!newChatTitle.trim() || isCreating}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-medium shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "創建中..." : "創建"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
