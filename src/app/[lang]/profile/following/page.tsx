"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/context/Translation";
import { IVendor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import useFollow from "@/hooks/useFollow";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";
import { getFollowingVendors } from "@/services/user.service";
import { useUserStore } from "@/stores/userStore";

export default function FollowingPage() {
  const followedVendors = useUserStore((state) => state.followedVendors);
  const follwingVendorsQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => getFollowingVendors()
  });
  const vendors = follwingVendorsQuery.data ?? [];

  if (!follwingVendorsQuery.isFetchedAfterMount && !vendors.length) return <LoadingSpinner />;

  if (!vendors.length) return <div className="py-4 text-center text-secondary">No Followed Vendors</div>;

  return (
    <ul>
      {vendors.map((vendor) => (
        <ListItem isFollowed={followedVendors.includes(vendor._id)} key={vendor._id} vendor={vendor} />
      ))}
    </ul>
  );
}

const ListItem = React.memo(
  function ListItem({ vendor, isFollowed }: { vendor: IVendor; isFollowed: boolean }) {
    const { t } = useTranslation();
    const handleFollow = useFollow({ vendor });

    return (
      <li className={`${isFollowed ? "opacity-100" : "opacity-60"} flex items-center justify-between px-4 py-2`}>
        <div className="flex w-full items-center gap-3">
          <Image
            alt={vendor.name}
            className="h-14 w-14 rounded-full bg-lightGray"
            height={66}
            src={vendor.imageUrl}
            width={66}
          />

          <div>
            <LocalLink className="font-bold" href={`/profile/vendor/${vendor.seName}`}>
              {vendor.name}
            </LocalLink>
            <p className="text-secondary">{vendor.productCount} Products</p>
          </div>
        </div>
        <div>
          <Button
            className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
            onClick={() => isFollowed && handleFollow(false)}
          >
            {t("unfollow")}
          </Button>
        </div>
      </li>
    );
  },
  (prev, next) => prev.vendor._id === next.vendor._id && prev.isFollowed === next.isFollowed
);
