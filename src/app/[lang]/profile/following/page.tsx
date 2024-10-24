"use client";

import Button from "@/components/Button";
import { queryClient } from "@/components/layout/MainLayout";
import { useTranslation } from "@/context/Translation";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

export default function FollowingPage() {
  const follwingVendorsQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => axiosInstanceNew.get<IVendor[]>("/api/user/followingVendors").then((res) => res.data)
  });
  return <ul>{follwingVendorsQuery.data?.map((vendor) => <ListItem key={vendor._id} vendor={vendor} />)}</ul>;
}

function ListItem({ vendor }: { vendor: IVendor }) {
  const { lang, t } = useTranslation();
  const { setFollowedVendors } = useUserStore();

  const unfollowMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => axiosInstanceNew.post(`/api/user/unfollowVendor/${vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      queryClient.fetchQuery({ queryKey: ["following"] });
      toast.warning("Vendor unFollowed");
    }
  });
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={vendor.name}
          className="h-14 w-14 rounded-full bg-lightGray"
          height={66}
          src={vendor.imageUrl}
          width={66}
        />

        <div>
          <Link className="font-bold" href={`/${lang}/profile/vendor/${vendor._id}`}>
            {vendor.name}
          </Link>
          <p className="text-strongGray">{vendor.productCount} Products</p>
        </div>
      </div>
      <div>
        <Button
          className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
          isLoading={unfollowMutation.isPending}
          onClick={() => unfollowMutation.mutate()}
        >
          {t("unfollow")}
        </Button>
      </div>
    </li>
  );
}
