import React from "react";

export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col h-full rounded-[24px] border border-[#D0E7C9] bg-[#EDF8E9] shadow-[0_6px_18px_rgba(20,83,45,0.09)] overflow-hidden animate-pulse"
      aria-hidden="true"
    >
      {/* Upper Image Section Skeleton */}
      <div className="relative aspect-square w-full bg-[#DDF1D5] rounded-t-[23px] flex items-center justify-center p-6">
        <div className="w-2/3 h-2/3 rounded-xl bg-[#D0E7C9]/40" />
        {/* Wishlist placeholder disc */}
        <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70" />
      </div>

      {/* Lower Product Info Section Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#EDF8E9] space-y-4">
        <div className="space-y-2">
          {/* Brand skeleton */}
          <div className="h-3 w-1/3 bg-[#D0E7C9]/70 rounded-full" />
          {/* Title skeleton */}
          <div className="h-4 w-4/5 bg-[#D0E7C9]/90 rounded-md" />
          <div className="h-4 w-3/5 bg-[#D0E7C9]/90 rounded-md" />
          {/* Rating / Stock skeleton */}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-2 h-2 rounded-full bg-[#D0E7C9]" />
            <div className="h-3 w-16 bg-[#D0E7C9]/60 rounded-full" />
          </div>
        </div>

        {/* Pill Button skeleton */}
        <div className="h-11 sm:h-12 w-full rounded-full border border-[#62A86A]/40 bg-white/40" />
      </div>
    </div>
  );
}

