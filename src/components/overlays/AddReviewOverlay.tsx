import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
// import { useAppStore } from "@/stores/appStore";
import { FieldError } from "@/types";
import RatingStars from "../ui/RatingStars";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { addReview } from "@/services/products.service";
import { useProductStore } from "@/stores/productStore";

type FormError = {
  reviewText: FieldError;
  rating: FieldError;
};

export default function AddReviewOverlay() {
  const productId = useProductStore((state) => state.productIdToOverlay);
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);
  const getReviews = useUserStore((state) => state.getReviews);
  const [form, setForm] = useState({ reviewText: "", rating: 0 });
  const [error, setError] = useState<FormError>({ reviewText: false, rating: false });

  const addReviewMutation = useMutation({
    mutationKey: ["AddReview", productId],
    mutationFn: (productId: string) => addReview(productId, form),
    onSuccess: () => {
      toast.success("Review Added Successfully");
      setForm({ rating: 0, reviewText: "" });
      getReviews();
      setIsAddReviewOpen(false);
    },

    onError: () => toast.error("Failed to add review")
  });

  const addReviewSubmit = () => {
    if (form.rating <= 0 || form.reviewText.length === 0 || !productId) return;
    addReviewMutation.mutate(productId);
  };

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  return (
    <OverlayLayout className="max-h-none" close={() => setIsAddReviewOpen(false)} title="Add Review">
      <RatingStars
        className="mb-2"
        isEditable
        rate={form.rating}
        onChange={(value) => setForm({ ...form, rating: value })}
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="mb-1 text-[15px]">Review Text</div>
        <div className="text-[12px] text-gray-400">{form.reviewText.length}/150</div>
      </div>
      <textarea
        className="w-full rounded-md border p-2.5 focus:border-primary focus:outline-none focus:ring-0"
        maxLength={150}
        name="reviewText"
        rows={4}
        value={form.reviewText}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
      ></textarea>
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error.reviewText}</div>

      <div className="flex justify-end">
        <Button className="bg-primary text-white" isLoading={addReviewMutation.isPending} onClick={addReviewSubmit}>
          Add
        </Button>
      </div>
    </OverlayLayout>
  );
}
