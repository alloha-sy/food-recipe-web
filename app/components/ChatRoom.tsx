"use client";

import { useState, useEffect, useRef } from "react";
import { rtdb } from "@/app/lib/firebase";
import { ref, push, onValue, off, update, get } from "firebase/database";
import { useAuth } from "@/app/contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUserPlus,
  faTimes,
  faChevronLeft,
  faUser,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface ChatRoomProps {
  recipeId?: string;
  onClose?: () => void;
  isFullScreen?: boolean;
  onMobileListChange: (show: boolean) => void;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function ChatRoom({
  recipeId,
  onClose,
  isFullScreen = false,
  onMobileListChange,
}: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    if (!user) return;
    const chatId = recipeId || "global";
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(
          ([id, msg]: [string, any]) => ({
            id,
            ...msg,
          })
        );
        setMessages(messageList);
      }
    });

    return () => off(messagesRef);
  }, [user, recipeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const chatId = recipeId || "global";
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
    const chatRef = ref(rtdb, `chats/${chatId}`);

    try {
      const newMessageRef = await push(messagesRef, {
        text: newMessage.trim(),
        userId: user.uid,
        userName: user.displayName || "匿名用戶",
        userPhotoURL: user.photoURL,
        timestamp: Date.now(),
      });

      await update(chatRef, {
        lastMessage: {
          text: newMessage.trim(),
          timestamp: Date.now(),
          userName: user.displayName || "匿名用戶",
        },
      });

      setNewMessage("");
    } catch (error) {
      toast.error("發送失敗，請稍後再試");
    }
  };

  const handleAddUser = async () => {
    if (!newEmail.trim() || addingUser) return;

    setAddingUser(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", newEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("找不到此用戶");
        return;
      }

      const targetUser = querySnapshot.docs[0].data();

      if (!targetUser.emailVerified) {
        toast.error("此用戶尚未驗證郵箱");
        return;
      }

      const chatId = recipeId || "global";
      const chatRef = ref(rtdb, `chats/${chatId}`);
      const chatSnapshot = await get(chatRef);
      const chatData = chatSnapshot.val() || {};

      if (chatData.members && chatData.members[targetUser.uid]) {
        toast.error("此用戶已在聊天室中");
        return;
      }

      await update(chatRef, {
        members: {
          ...(chatData.members || {}),
          [targetUser.uid]: {
            email: targetUser.email,
            displayName: targetUser.displayName,
            photoURL: targetUser.photoURL,
            joinedAt: Date.now(),
          },
        },
      });

      setShowAddUser(false);
      setNewEmail("");
      toast.success("用戶已添加到聊天室");
    } catch (error) {
      console.error("添加用戶失敗:", error);
      toast.error("添加用戶失敗，請稍後再試");
    } finally {
      setAddingUser(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleAddUserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUser();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onMobileListChange(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faComments}
              className="w-5 h-5 text-orange-600"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {recipeId ? "食譜討論" : "美食聊天室"}
            </h2>
          </div>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="p-2.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
        >
          <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === user?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start gap-3 max-w-[85%] md:max-w-[70%]">
              {message.userId !== user?.uid && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {message.userPhotoURL ? (
                      <img
                        src={message.userPhotoURL}
                        alt={message.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-4 h-4 text-gray-600"
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col min-w-0">
                {message.userId !== user?.uid && (
                  <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {message.userName}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm overflow-hidden ${
                    message.userId === user?.uid
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-br-sm"
                      : "bg-white rounded-bl-sm"
                  }`}
                >
                  <p className="break-words leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[300px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    {message.text}
                  </p>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.userId === user?.uid ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex-shrink-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 sticky bottom-0 z-10"
      >
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入訊息... (Shift + Enter 換行)"
            className="flex-1 px-4 md:px-6 py-3 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 shadow-sm resize-none min-h-[3rem] max-h-[150px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            rows={Math.min(5, newMessage.split("\n").length || 1)}
            style={{
              height: "auto",
              minHeight: "3rem",
              maxHeight: "150px",
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex-shrink-0"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showAddUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              添加用戶
            </h3>
            <input
              type="email"
              placeholder="輸入用戶郵箱..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleAddUserKeyDown}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newEmail.trim() || addingUser}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-medium shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingUser ? "添加中..." : "添加"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
