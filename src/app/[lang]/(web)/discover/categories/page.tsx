"use client";

import { ICategory } from "@/types";
import { useTranslation } from "@/context/Translation";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import Button from "@/components/ui/Button";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import { getCategories } from "@/services/products.service";

type ListItemProps = {
  category: ICategory;
  to: string;
};

export default function Page() {
  const { t } = useTranslation();

  const categoriesQuery = useInfiniteQuery({
    queryKey: ["categoriesDiscover"],
    queryFn: ({ pageParam }) => getCategories({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const categoriesPages = categoriesQuery.data?.pages ?? [];
  const lastPage = categoriesPages?.findLast((page) => page);

  return (
    <ul className="mt-14 md:mt-4">
      {categoriesPages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((category) => (
            <ListItem category={category} key={category._id} to={`/profile/category/${category.seName}`} />
          ))}
        </React.Fragment>
      ))}

      {categoriesQuery.isFetching ? (
        <Loading />
      ) : lastPage && lastPage.pages.hasNext ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={categoriesQuery.isFetchingNextPage}
            onClick={() => categoriesQuery.fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        </div>
      ) : null}
    </ul>
  );
}

function ListItem({ to, category }: ListItemProps) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <LocalLink className="font-bold hover:underline" href={to}>
          {category.name}
        </LocalLink>
      </div>
      <p className="text-gray-400">
        {t("discover.products")}: {category.productsCount || 0}
      </p>
    </li>
  );
}
