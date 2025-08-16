import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Hero Skeleton */}
      <div className="w-full h-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer rounded-lg" />
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer rounded" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer rounded w-3/4" />
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer rounded w-20" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Loading Elements */}
      <div className="flex items-center justify-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-r from-gold-200 to-gold-300 shimmer rounded-full" />
        <div className="w-8 h-8 bg-gradient-to-r from-gold-200 to-gold-300 shimmer rounded-full" />
        <div className="w-8 h-8 bg-gradient-to-r from-gold-200 to-gold-300 shimmer rounded-full" />
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-gold-600">
          <div className="w-4 h-4 bg-gradient-to-r from-gold-400 to-gold-500 shimmer rounded-full" />
          <span className="font-medium">Loading premium jewelry collection...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;