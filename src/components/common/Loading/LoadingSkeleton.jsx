import React from 'react';

// University Card Skeleton - phù hợp với UniversityCard component
const UniversityCardSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse border border-gray-200 rounded-lg p-4 bg-white mb-4 ${className}`}>
      <div className="flex items-center p-2">
        {/* Logo Section */}
        <div className="mr-6">
          <div className="w-24 h-24 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* University Info */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-64"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-64"></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
              </div>

              {/* Major Tags */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-24 "></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
const TableRowSkeleton = ({ columns = 4, className = "" }) => {
  return (
    <div className={`animate-pulse flex items-center gap-4 p-4 ${className}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <div 
          key={index} 
          className={`h-4 bg-slate-300 dark:bg-slate-600 rounded ${
            index === 0 ? 'w-16' : index === columns - 1 ? 'w-20' : 'flex-1'
          }`}
        ></div>
      ))}
    </div>
  );
};

// List Item Skeleton
const ListItemSkeleton = ({ showAvatar = true, className = "" }) => {
  return (
    <div className={`animate-pulse flex items-center gap-3 p-3 ${className}`}>
      {showAvatar && (
        <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      )}
      <div className="flex-1">
        <div className="w-3/4 h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
        <div className="w-1/2 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
      </div>
    </div>
  );
};

// Text Block Skeleton
const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 bg-slate-300 dark:bg-slate-600 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Page Loading Skeleton
const PageSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse p-6 ${className}`}>
      {/* Header */}
      <div className="w-1/3 h-8 bg-slate-300 dark:bg-slate-600 rounded mb-6"></div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="w-full h-40 bg-slate-300 dark:bg-slate-600 rounded"></div>
            <div className="w-3/4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
            <div className="w-1/2 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Spinner Loading
const SpinnerLoading = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6", 
    large: "w-8 h-8"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
};

const Loading = ({ 
  type = "spinner", 
  size = "default",
  tip = "",
  spinning = true,
  children,
  className = "",
  ...props 
}) => {
  if (!spinning && children) {
    return children;
  }

  const renderSkeleton = () => {
    switch (type) {
      case "university":
      case "card":
        return <UniversityCardSkeleton className={className} {...props} />;
      case "table":
        return <TableRowSkeleton className={className} {...props} />;
      case "list":
        return <ListItemSkeleton className={className} {...props} />;
      case "text":
        return <TextSkeleton className={className} {...props} />;
      case "page":
        return <PageSkeleton className={className} {...props} />;
      case "spinner":
      default:
        return (
          <div className={`flex flex-col items-center gap-2 ${className}`}>
            <SpinnerLoading size={size} />
            {tip && <span className="text-sm text-slate-500">{tip}</span>}
          </div>
        );
    }
  };

  if (children) {
    return (
      <div className="relative">
        {children}
        {spinning && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <SpinnerLoading size={size} />
              {tip && <span className="text-sm text-slate-500">{tip}</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return renderSkeleton();
};

export default Loading;
export { 
  UniversityCardSkeleton, 
  TableRowSkeleton, 
  ListItemSkeleton, 
  TextSkeleton, 
  PageSkeleton, 
  SpinnerLoading 
}; 