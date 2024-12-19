"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  OrderByDirection,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Recipe } from "@/app/types/recipe";

import RecipeCard from "@/app/components/RecipeCard";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faPlus,
  faFilter,
  faSort,
  faSearch,
  faArrowUpLong,
  faArrowDownLong,
} from "@fortawesome/free-solid-svg-icons";

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [sortDirection, setSortDirection] = useState<OrderByDirection>("desc");
  const [difficulty, setDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let q: Query<DocumentData> = collection(db, "recipes");
      const conditions = [];

      if (difficulty !== "all") {
        conditions.push(where("difficulty", "==", difficulty));
      }

      if (sortBy === "latest") {
        conditions.push(orderBy("createdAt", sortDirection));
      } else if (sortBy === "rating") {
        conditions.push(orderBy("averageRating", sortDirection));
      }

      q = query(q, ...conditions);
      const querySnapshot = await getDocs(q);
      const recipesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[];

      setAllRecipes(recipesData);
      setFilteredRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecipes(allRecipes);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = allRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower)
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, allRecipes]);

  useEffect(() => {
    fetchRecipes();
  }, [sortBy, sortDirection, difficulty]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white/50">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">美食食譜</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
              <span>篩選</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜尋食譜..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">排序方式：</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "latest"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    最新發布
                  </button>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "rating"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    評分最高
                  </button>
                  <button
                    onClick={toggleSortDirection}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={
                        sortDirection === "desc"
                          ? faArrowDownLong
                          : faArrowUpLong
                      }
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">難度：</span>
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "全部" },
                    { value: "easy", label: "簡單" },
                    { value: "medium", label: "中等" },
                    { value: "hard", label: "困難" },
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() =>
                        setDifficulty(level.value as typeof difficulty)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        difficulty === level.value
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FontAwesomeIcon
                icon={faUtensils}
                className="w-12 h-12 text-orange-500"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              還沒有食譜
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              目前還沒有任何食譜。分享您的獨家美味，成為第一個分享食譜的人！
            </p>
            {user ? (
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md"
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                <span>立即分享食譜</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md"
              >
                登入以分享食譜
              </Link>
            )}

            <div className="mt-12 w-full max-w-2xl">
              <div className="bg-gradient-to-br from-orange-10 to-pink-10 rounded-2xl p-8 border border-orange-100/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text mb-4">
                  分享食譜小提示
                </h3>
                <ul className="text-gray-600 space-y-3">
                  {[
                    "詳細的步驟說明有助於他人重現美味",
                    "可以加入食材的準備建議",
                    "分享您的獨特烹飪技巧",
                    "記得標註食材的精確用量",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[calc(100vh-12rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={fetchRecipes}
                />
              ))}
            </div>

            {user && (
              <Link
                href="/recipes/new"
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="sr-only">分享食譜</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
