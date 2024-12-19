import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  setRating,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => setRating?.(star)}
          className={`transition-transform ${
            !readonly && "hover:scale-110 cursor-pointer"
          } ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          <FontAwesomeIcon
            icon={faStarSolid}
            className={`${sizes[size]} ${!readonly && "hover:text-yellow-500"}`}
          />
        </button>
      ))}
    </div>
  );
}
