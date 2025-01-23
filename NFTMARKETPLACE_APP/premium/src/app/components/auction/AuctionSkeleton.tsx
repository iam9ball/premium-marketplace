"use client";
import { motion } from "framer-motion";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="py-4 min-h-screen flex flex-col">
          {/* Mobile View: Rotating Cube Skeleton */}
          <div className="block lg:hidden w-full mb-4">
            <div className="w-full max-w-[300px] mx-auto aspect-square bg-gray-800 animate-pulse rounded-lg" />
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-4 flex-grow">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {/* Desktop Rotating Cube Skeleton */}
              <div className="hidden lg:block">
                <div className="w-full max-w-[300px] mx-auto aspect-square bg-gray-800 animate-pulse rounded-lg" />
              </div>
              
              {/* Auction Details Skeleton */}
              <div className="bg-gray-800 rounded-lg p-4 h-[300px] animate-pulse">
                {/* Title bar */}
                <div className="h-8 w-48 bg-gray-700 rounded mb-4" />
                {/* Content lines */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-11/12" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {/* Bidding System Skeleton */}
              <div className="bg-gray-800 rounded-lg p-4 h-[300px] animate-pulse">
                <div className="h-8 w-32 bg-gray-700 rounded mb-4" />
                <div className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-48" />
                  <div className="h-6 bg-gray-700 rounded w-36" />
                  <div className="flex gap-2 mt-4">
                    <div className="flex-grow h-10 bg-gray-700 rounded" />
                    <div className="w-24 h-10 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>

              {/* Auction Commentary Skeleton */}
              <div className="bg-gray-800 rounded-lg p-4 h-[150px] animate-pulse">
                <div className="h-8 w-56 bg-gray-700 rounded mb-4" />
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto" />
              </div>

              {/* Live Chat Skeleton */}
              <div className="bg-gray-800 rounded-lg p-4 h-[300px] animate-pulse">
                <div className="h-8 w-32 bg-gray-700 rounded mb-4" />
                <div className="space-y-3 mb-4">
                  <div className="h-12 bg-gray-700 rounded w-11/12" />
                  <div className="h-12 bg-gray-700 rounded w-3/4" />
                  <div className="h-12 bg-gray-700 rounded w-5/6" />
                </div>
                <div className="flex gap-2 mt-auto">
                  <div className="flex-grow h-10 bg-gray-700 rounded" />
                  <div className="w-24 h-10 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;