import React from 'react';

// Base Skeleton Component
const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="space-y-4">
        <Skeleton className="w-full h-96 rounded-lg" />
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-16 h-16 rounded-md" />
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>

    {/* Description Section */}
    <div className="mt-12 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <div className="flex space-x-4 p-4 border-b">
    <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-32" />
    <div className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

// User Profile Skeleton
export const UserProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  </div>
);

// Order History Skeleton
export const OrderHistorySkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-3">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex space-x-3">
              <Skeleton className="w-12 h-12 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

// Navbar Skeleton
export const NavbarSkeleton = () => (
  <div className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64 rounded-md" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4 p-4 bg-white rounded-lg shadow-md">
        <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Page Loading Skeleton
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <NavbarSkeleton />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <ProductGridSkeleton count={8} />
    </div>
  </div>
);

export default Skeleton;
