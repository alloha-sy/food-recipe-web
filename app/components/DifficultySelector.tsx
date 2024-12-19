import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignal } from "@fortawesome/free-solid-svg-icons";

interface DifficultySelectorProps {
  value: "easy" | "medium" | "hard";
  onChange: (value: "easy" | "medium" | "hard") => void;
}

export default function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
          <FontAwesomeIcon
            icon={faSignal}
            className="w-5 h-5 text-orange-500"
          />
          食譜難易度
        </h2>
      </div>
      <div className="p-6">
        <div className="flex gap-4">
          {[
            { value: "easy", label: "簡單" },
            { value: "medium", label: "中等" },
            { value: "hard", label: "困難" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(option.value as "easy" | "medium" | "hard")
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                value === option.value
                  ? difficultyColors[option.value]
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
