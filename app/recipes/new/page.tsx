"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUtensils,
  faListOl,
  faArrowLeft,
  faFileText,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Difficulty } from "@/app/types/recipe";
import DifficultySelector from "@/app/components/DifficultySelector";

const COMMON_UNITS = [
  "克",
  "公克",
  "公斤",
  "毫升",
  "公升",
  "茶匙",
  "湯匙",
  "碗",
  "杯",
  "個",
  "片",
];

export default function NewRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [{ name: "", amount: "", unit: "" }],
    steps: [{ content: "" }],
    difficulty: "medium" as Difficulty,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("請先登入");
      router.push("/login");
      return;
    }

    // 表單驗證
    if (!formData.title.trim()) {
      toast.error("請輸入食譜名稱");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("請輸入食譜簡介");
      return;
    }

    const validIngredients = formData.ingredients.filter(
      (i) => i.name.trim() && i.amount.trim() && i.unit.trim()
    );
    if (validIngredients.length === 0) {
      toast.error("請至少新增一個食材");
      return;
    }

    const validSteps = formData.steps.filter((s) => s.content.trim());
    if (validSteps.length === 0) {
      toast.error("請至少新增一個步驟");
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: validIngredients.map((i) => ({
          name: i.name.trim(),
          amount: i.amount.trim(),
          unit: i.unit.trim(),
        })),
        steps: validSteps.map((s, index) => ({
          number: index + 1,
          content: s.content.trim(),
        })),
        authorId: user.uid,
        authorName: user.displayName || "匿名用戶",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        difficulty: formData.difficulty,
        cookingTime: 30,
      };

      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      toast.success("食譜發布成功！");
      router.push(`/recipes/${docRef.id}`);
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error("發布失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按鈕 */}
      <div className="mb-6">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span>返回食譜列表</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text mb-2">
          分享美食食譜
        </h1>
        <p className="text-gray-600">
          記錄您的獨家配方，與美食愛好者分享烹飪樂趣
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本資訊卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
              <FontAwesomeIcon
                icon={faUtensils}
                className="w-5 h-5 text-orange-500" // 明確設定固定大小
                style={{ minWidth: "1.25rem" }} // 確保最小寬度
              />
              基本資訊
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食譜名稱
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="為您的美味佳餚取個名字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食譜簡介
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                rows={3}
                placeholder="簡單描述這道料理的特色..."
              />
            </div>
          </div>
        </div>

        {/* 食材清單卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
              <FontAwesomeIcon
                icon={faFileText}
                className="w-5 h-5 text-orange-500"
              />
              食材清單
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {COMMON_UNITS.map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => {
                    const lastIngredient =
                      formData.ingredients[formData.ingredients.length - 1];
                    if (lastIngredient) {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[formData.ingredients.length - 1].unit =
                        unit;
                      setFormData({ ...formData, ingredients: newIngredients });
                    }
                  }}
                  className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors border border-orange-100 font-medium"
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder="食材名稱"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].name = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <input
                  type="text"
                  placeholder="數量"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].amount = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="w-24 px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <div className="relative w-24">
                  <input
                    type="text"
                    placeholder="單位"
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index].unit = e.target.value;
                      setFormData({ ...formData, ingredients: newIngredients });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  ingredients: [
                    ...formData.ingredients,
                    { name: "", amount: "", unit: "" },
                  ],
                })
              }
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <FontAwesomeIcon icon={faPlus} />
              新增食材
            </button>
          </div>
        </div>

        {/* 烹飪步驟卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
              <FontAwesomeIcon
                icon={faListOl}
                className="w-5 h-5 text-orange-500"
              />
              烹飪步驟
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {formData.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute left-4 top-4 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                  {index + 1}
                </div>
                <textarea
                  value={step.content}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[index].content = e.target.value;
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="w-full pl-14 pr-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                  rows={3}
                  placeholder={`描述步驟 ${index + 1} 的詳細做法...`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  steps: [...formData.steps, { content: "" }],
                })
              }
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <FontAwesomeIcon icon={faPlus} />
              新增步驟
            </button>
          </div>
        </div>

        {/* 難度選擇 */}
        <DifficultySelector
          value={formData.difficulty}
          onChange={(value) => setFormData({ ...formData, difficulty: value })}
        />

        {/* 發布按鈕 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-4">
          <div className="max-w-4xl mx-auto">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>發布中...</span>
                </div>
              ) : (
                "發布食譜"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
