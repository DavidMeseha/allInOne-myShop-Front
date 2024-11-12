"use client";

import React from "react";
import { IFullProduct } from "../types";
import { useUser } from "../context/user";
import { useGeneralStore } from "../stores/generalStore";
import { BsStarFill } from "react-icons/bs";
import { useUserStore } from "@/stores/userStore";

type Props = {
  product: IFullProduct;
};

export default function RateProductButton({ product }: Props) {
  const { user } = useUser();
  const { reviewedProducts } = useUserStore();
  const { setIsAddReviewOpen, setIsLoginOpen } = useGeneralStore();
  const isReviewed = reviewedProducts.includes(product._id);

  const handleAddreviewClick = () => {
    if (!user) return;
    if (!user.isRegistered) return setIsLoginOpen(true);
    if (!isReviewed) setIsAddReviewOpen(true, product._id);
  };

  return (
    <button aria-label="Open Review Form" className="fill-black text-center" onClick={handleAddreviewClick}>
      <div className="rounded-full bg-gray-200 p-2">
        <BsStarFill
          className={`transition-all ${isReviewed ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </div>
      <span className="text-blend text-sm font-semibold">
        {product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews || 0}
      </span>
    </button>
  );
}
