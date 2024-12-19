import { Recipe } from "@/app/types/recipe";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from "@/app/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const difficultyLabels = {
    easy: "簡單",
    medium: "中等",
    hard: "困難",
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "recipes", recipe.id));
      toast.success("食譜已刪除");
      onDelete?.();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link
        href={`/recipes/${recipe.id}`}
        className="block hover:opacity-75 transition-opacity relative group"
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {recipe.title}
              </h3>

              {user?.uid === recipe.authorId && (
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/recipes/${recipe.id}/edit`);
                    }}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[recipe.difficulty]
                }`}
              >
                {difficultyLabels[recipe.difficulty]}
              </span>

              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faStar}
                  className="w-4 h-4 text-yellow-400"
                />
                <span className="text-sm text-gray-600">
                  {recipe.averageRating
                    ? recipe.averageRating.toFixed(1)
                    : "尚無評分"}
                </span>
                {recipe.totalRatings && (
                  <span className="text-sm text-gray-400">
                    ({recipe.totalRatings} 則評價)
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
              {recipe.description}
            </p>

            <div className="text-sm text-gray-500 mt-auto">
              <p className="flex items-center gap-2">
                <span className="truncate max-w-[100px]">
                  {recipe.authorName}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="flex-shrink-0">
                  {new Date(recipe.createdAt?.toDate()).toLocaleDateString(
                    "zh-TW",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Link>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl transform transition-all animate-fade-in"
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="w-8 h-8 text-red-500"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              刪除食譜
            </h3>
            <p className="text-gray-600 text-center mb-8">
              確定要刪除「{recipe.title}」嗎？
              <br />
              此操作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>刪除中</span>
                  </div>
                ) : (
                  "確認刪除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
