"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Comment } from "@/app/types/recipe";
import StarRating from "./StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faReply,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CommentSectionProps {
  recipeId: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  onAddCommentAction: (
    rating: number | undefined,
    content: string,
    replyTo?: string | null
  ) => Promise<void>;
}

const CommentForm = memo(
  ({
    parentId = null,
    content,
    setContent,
    showRating,
    setShowRating,
    newRating,
    setNewRating,
    setReplyTo,
    isSubmitting,
    onSubmit,
    user,
  }: {
    parentId?: string | null;
    content: string;
    setContent: (content: string) => void;
    showRating: boolean;
    setShowRating: (show: boolean) => void;
    newRating: number;
    setNewRating: (rating: number) => void;
    setReplyTo: (replyTo: string | null) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    user: any;
  }) => (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "使用者"}
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="w-5 h-5 text-orange-600"
            />
          )}
        </div>
        <div className="flex-1 space-y-4">
          {!parentId && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRating(!showRating);
                }}
                className="flex items-center gap-3 text-gray-500 hover:text-orange-500 transition-colors"
              >
                <div className="relative w-10 h-6">
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
                      showRating ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                      showRating ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium leading-none">
                  添加評分
                </span>
              </button>
            </div>
          )}
          {showRating && !parentId && (
            <div className="flex items-center gap-2">
              <StarRating rating={newRating} setRating={setNewRating} />
              <span className="text-sm text-gray-500">選擇評分</span>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isSubmitting && (content.trim() || showRating)) {
                  onSubmit(e as unknown as React.FormEvent);
                }
              }
            }}
            placeholder={parentId ? "回覆評論..." : "分享您的用餐經驗..."}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
            rows={3}
          />
          <div className="flex justify-end">
            {parentId && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="mr-3 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                取消
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || (!content.trim() && !showRating)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "發布中..." : parentId ? "回覆" : "發布評論"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
);

CommentForm.displayName = "CommentForm";

const LoginPrompt = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-orange-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          分享您的用餐體驗
        </h3>
        <p className="text-gray-500">登入即可參與評論與評分</p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
        立即登入
      </Link>
    </div>
  </div>
);

export default function CommentSection({
  recipeId,
  comments,
  averageRating,
  totalRatings,
  onAddCommentAction,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [newRating, setNewRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [localAverageRating, setLocalAverageRating] = useState(averageRating);
  const [localTotalRatings, setLocalTotalRatings] = useState(totalRatings);
  const router = useRouter();

  useEffect(() => {
    setLocalComments(comments);
    setLocalAverageRating(averageRating);
    setLocalTotalRatings(totalRatings);
  }, [comments, averageRating, totalRatings]);

  // 過濾出頂層評論和回覆
  const topLevelComments = localComments.filter((comment) => !comment.parentId);
  const repliesMap = localComments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) acc[comment.parentId] = [];
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim() && !showRating) return;

      setIsSubmitting(true);
      try {
        await onAddCommentAction(
          showRating ? newRating : undefined,
          content.trim() || "",
          replyTo
        );
        setContent("");
        setNewRating(5);
        setReplyTo(null);
        setShowRating(false);
        router.refresh();
      } catch (error) {
        console.error("Error submitting comment:", error);
        toast.error("評論發布失敗，請稍後再試");
      } finally {
        setIsSubmitting(false);
      }
    },
    [content, showRating, newRating, replyTo, onAddCommentAction, router]
  );

  return (
    <div className="space-y-8">
      {/* 總評分區域 */}
      {localTotalRatings > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {localAverageRating.toFixed(1)}
              </div>
              <StarRating rating={localAverageRating} readonly size="lg" />
              <div className="text-sm text-gray-500 mt-1">
                {localTotalRatings} 則評分
              </div>
            </div>

            {/* 評分分布 */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = localComments.filter(
                  (comment) => comment.rating === star
                ).length;
                const percentage = (count / localTotalRatings) * 100;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm text-gray-600">{star}</span>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="w-4 h-4 text-yellow-400"
                      />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faStar}
              className="w-8 h-8 text-orange-500"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            成為第一個評價的人
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            這道料理還沒有評價。分享您的用餐體驗，幫助其他人更了解這道美食！
          </p>
        </div>
      )}

      {/* 評論輸入區域 */}
      {user ? (
        !replyTo && (
          <CommentForm
            content={content}
            setContent={setContent}
            showRating={showRating}
            setShowRating={setShowRating}
            newRating={newRating}
            setNewRating={setNewRating}
            setReplyTo={setReplyTo}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            user={user}
          />
        )
      ) : (
        <LoginPrompt />
      )}

      {/* 評論表 */}
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <div key={comment.id}>
            {/* 主評論 */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                  {comment.userPhotoURL ? (
                    <img
                      src={comment.userPhotoURL}
                      alt={comment.userName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-5 h-5 text-orange-600"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {comment.userName}
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.rating && (
                      <StarRating rating={comment.rating} readonly size="sm" />
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt?.toDate()).toLocaleDateString(
                        "zh-TW",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 pl-14 whitespace-pre-wrap">
                {comment.content}
              </p>
              {user && !replyTo && (
                <div className="pl-14">
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="text-gray-500 hover:text-orange-500 transition-colors text-sm flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faReply} className="w-4 h-4" />
                    回覆
                  </button>
                </div>
              )}
            </div>

            {/* 回覆列表 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3 pl-12">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                        {reply.userPhotoURL ? (
                          <img
                            src={reply.userPhotoURL}
                            alt={reply.userName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faUser}
                            className="w-4 h-4 text-orange-600"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {reply.userName}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(
                            reply.createdAt?.toDate()
                          ).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 pl-12 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 回覆表單 */}
            {replyTo === comment.id && user && (
              <div className="mt-3 pl-12">
                <CommentForm
                  parentId={comment.id}
                  content={content}
                  setContent={setContent}
                  showRating={showRating}
                  setShowRating={setShowRating}
                  newRating={newRating}
                  setNewRating={setNewRating}
                  setReplyTo={setReplyTo}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  user={user}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
