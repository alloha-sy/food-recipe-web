"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUtensils,
  faListOl,
  faArrowLeft,
  faExchange,
  faSignal,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { Recipe, Ingredient, Step } from "@/app/types/recipe";
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

export default function EditRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [] as Ingredient[],
    steps: [] as Step[],
    difficulty: "medium" as "easy" | "medium" | "hard",
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title,
            description: data.description,
            ingredients: data.ingredients,
            steps: data.steps.map((s: any) => ({ content: s.content })),
            difficulty: data.difficulty,
          });

          // 檢查是否為作者
          if (data.authorId !== user?.uid) {
            toast.error("您沒有權限編輯此食譜");
            router.push("/recipes");
          }
        } else {
          toast.error("找不到此食譜");
          router.push("/recipes");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error("載入食譜失敗");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecipe();
    } else {
      router.push("/login");
    }
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("請先登入");
      router.push("/login");
      return;
    }

    // 表單驗
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

    setSaving(true);
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
        updatedAt: new Date(),
        difficulty: formData.difficulty,
      };

      await updateDoc(doc(db, "recipes", id as string), recipeData);
      toast.success("食譜更新成功！");
      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按鈕 */}
      <div className="mb-6">
        <Link
          href={`/recipes/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span>返回食譜</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text mb-2">
          編輯食譜
        </h1>
        <p className="text-gray-600">修改您的食譜內容</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本資訊卡片 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
              <FontAwesomeIcon
                icon={faUtensils}
                className="w-5 h-5 text-orange-500"
                style={{ minWidth: "1.25rem" }}
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
                icon={faListOl}
                className="w-5 h-5 text-orange-500"
                style={{ minWidth: "1.25rem" }}
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
                <input
                  type="text"
                  placeholder="單位"
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].unit = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="w-24 px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                />
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
                style={{ minWidth: "1.25rem" }}
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

        <DifficultySelector
          value={formData.difficulty}
          onChange={(value) => setFormData({ ...formData, difficulty: value })}
        />

        {/* 更新按鈕 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-4">
          <div className="max-w-4xl mx-auto">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>更新中...</span>
                </div>
              ) : (
                "更新食譜"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
