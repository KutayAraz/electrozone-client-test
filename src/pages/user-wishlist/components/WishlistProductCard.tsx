import { Link } from "react-router-dom";
import { ReactComponent as HeartIcon } from "@assets/svg/wishlist-heart.svg";
import { useState } from "react";
import { Rating } from "@mui/material";

export interface WishlistProductCardProps {
  id: number;
  productName: string;
  brand: string;
  thumbnail: string;
  price: number;
  averageRating: number;
  stock: number;
  subcategory: string;
  category: string;
  onAddToCart: (id: number, e: React.MouseEvent) => void;
  onRemoveFromWishlist: (id: number) => void;
}

const WishlistProductCard = ({
  id,
  productName,
  brand,
  thumbnail,
  price,
  averageRating,
  stock,
  subcategory,
  category,
  onAddToCart,
  onRemoveFromWishlist,
}: WishlistProductCardProps) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div className="border-1 rounded-md mx-2 my-2 p-1 flex flex-col space-x-2 relative group">
      <div className="flex justify-between items-start mb-2">
        <button
          onClick={() => onRemoveFromWishlist(id)}
          className="transition-transform duration-300 transform scale-100 group-hover:scale-110 ml-auto"
        >
          <HeartIcon
            className={`w-10 h-auto inline-block ${
              isClicked ? "transform scale-125" : ""
            }`}
            fill={"#febd69"}
          />
        </button>
      </div>

      <Link to={`/${category}/${subcategory}/${id}`} className="block mb-2">
        <img
          src={thumbnail}
          alt={`thumbnail image for ${productName}`}
          className="w-auto h-32 object-contain mx-auto"
        />
      </Link>

      <Link to={`/${category}/${subcategory}/${id}`} className="space-y-2">
        <p>{productName}</p>
        <p>{brand}</p>
        <Rating
          name="half-rating-read"
          value={averageRating}
          precision={0.1}
          readOnly
        />
        <p>$ {price.toFixed(2)}</p>
        {stock < 1 && (
          <p className="text-red-500 italic">Product out of stock</p>
        )}
        <button
          onClick={(e) => onAddToCart(id, e)}
          className="bg-theme-blue text-white p-[0.25rem] hover:bg-blue-600 rounded-lg w-full text-center"
        >
          Add to Cart
        </button>
      </Link>
    </div>
  );
};

export default WishlistProductCard;
