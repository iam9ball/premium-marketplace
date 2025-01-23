import React from 'react';

const DetailsSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full min-h-[90vh] p-4 md:p-8 flex justify-center items-center">
        <div className="w-full max-w-6xl relative">
          <div className="absolute inset-0 rounded-xl opacity-75 blur-sm bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
          
          <div className="relative bg-gray-900 rounded-xl p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none bg-gray-800 rounded-lg animate-pulse" />

            {/* Content Skeleton */}
            <div className="flex flex-col justify-center items-center lg:items-start space-y-6">
              <div className="space-y-6 w-full text-center lg:text-left">
                {/* Status */}
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-24 h-6 bg-gray-800 rounded animate-pulse" />
                </div>

                {/* Title and Info */}
                <div className="space-y-4">
                  <div className="w-3/4 h-8 bg-gray-800 rounded animate-pulse" />
                  <div className="w-1/2 h-6 bg-gray-800 rounded animate-pulse" />
                  <div className="w-2/3 h-6 bg-gray-800 rounded animate-pulse" />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center lg:justify-start">
                  <div className="flex-1 h-12 bg-gray-800 rounded animate-pulse" />
                  <div className="flex-1 h-12 bg-gray-800 rounded animate-pulse" />
                </div>

                {/* Time */}
                <div className="flex items-center justify-center lg:justify-start mt-4">
                  <div className="w-32 h-6 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NFT Details Card */}
          <div className="bg-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
            <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse mx-auto" />
            <div className="space-y-4 pt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="h-8 w-1/3 bg-gray-700 rounded animate-pulse mb-6" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSkeleton;