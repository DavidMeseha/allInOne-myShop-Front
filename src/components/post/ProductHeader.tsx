"use client";

import Link from "next/link";
import LikeProductButton from "../LikeProductButton";
import AddToCartButton from "../AddToCartButton";
import SaveProductButton from "../SaveProductButton";
import Image from "next/image";
import { IFullProduct } from "@/types";

export interface CommentsHeaderCompTypes {
  product: IFullProduct;
}

export default function ProductHeader({ product }: CommentsHeaderCompTypes) {
  return (
    <>
      <div className="flex items-center px-8 pt-4">
        <Link href={`/profile/vendor/${product.vendor._id}`}>
          <Image
            alt="comment profile"
            className="mx-auto h-10 w-10 rounded-full object-cover lg:mx-0"
            height={50}
            src={product.vendor.imageUrl}
            width={50}
          />
        </Link>
        <div className="ml-3 pt-0.5">
          <div className="relative z-10 font-semibold hover:underline">{product.name}</div>

          <div className="relative text-sm text-strongGray">
            by:
            <Link className="hover:text-primary" href={`/profile/vendor/${product.vendor._id}`}>
              {" " + product.vendor.name}
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 px-8 text-sm" dangerouslySetInnerHTML={{ __html: product?.fullDescription }}></p>

      <div className="mb-4 mt-8 flex items-center px-8">
        <LikeProductButton product={product} />
        <SaveProductButton product={product} />
        <AddToCartButton product={product} />
      </div>
    </>
  );
}
