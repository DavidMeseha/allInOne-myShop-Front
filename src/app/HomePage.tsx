"use client";

import { BsSearch } from "react-icons/bs";
import { BiLoaderCircle, BiMenu } from "react-icons/bi";
import { useGeneralStore } from "@/stores/generalStore";
import HomeMenu from "@/components/overlays/HomeMenu";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/context/Translation";
import { IFullProduct, Pagination } from "../types";
import Button from "@/components/Button";
import ProductHomeCard from "@/components/ProductHomeCard";

type Props = {
  products: IFullProduct[];
  loadMore: (page: number) => Promise<{ data: IFullProduct[]; pages: Pagination }>;
};

export default function HomePage({ products, loadMore }: Props) {
  const { setIsHomeMenuOpen, setIsSearchOpen } = useGeneralStore();
  const { t } = useTranslation();

  const [productsList, setProducts] = useState<IFullProduct[]>([...products]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (isInView && hasMore && loadMore) {
      loadMore(page + 1).then((res) => {
        if (res.data.length < 1) return setHasMore(false);
        setHasMore(res.pages.hasNext);
        setProducts([...productsList, ...res.data]);
        setPage(page + 1);
      });
    }
  }, [isInView]);

  return (
    <>
      <div className="relative">
        <div className="mx-auto mt-4 grid grid-cols-2 gap-2 px-4 md:max-w-[600px] md:grid-cols-2 md:gap-3 lg:max-w-[900px] lg:grid-cols-3">
          {productsList.map((product, index) => (
            <ProductHomeCard key={index} product={product} />
          ))}
        </div>
        <div className="flex justify-center py-7 text-center">
          {hasMore ? (
            <BiLoaderCircle className="animate-spin fill-primary" data-testid="loading" size={35} />
          ) : (
            t("endOfContent")
          )}
        </div>
      </div>
      <div className="fixed end-0 start-0 top-0 z-20 flex w-full justify-between border-b bg-white p-2 md:hidden">
        <Button aria-label="Open Main Menu" className="p-0" onClick={() => setIsHomeMenuOpen(true)}>
          <BiMenu className="fill-black" size={25} />
        </Button>
        <h1 className="text-xl font-bold">Home</h1>
        <Button aria-label="Open Search Page" className="p-0" onClick={() => setIsSearchOpen(true)}>
          <BsSearch className="fill-black" size={25} />
        </Button>
      </div>
      <HomeMenu />
      <div className="absolute bottom-0 -z-40 h-screen w-full md:h-[700px]" data-testid="load-more" ref={ref}></div>
    </>
  );
}
