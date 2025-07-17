import React from 'react';

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"


const UniversityCardSkeleton = () => {
  return (
    <div className="animate-pulse border border-gray-200 rounded-lg p-4 bg-white mb-4">
      <div className="flex items-center p-2">
        <div className="mr-6">
          <div className="w-24 h-24 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-64"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-64"></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-28"></div>
              </div>
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

const NewsSkeleton = () => {
  return (
    <div className="animate-pulse border-b border-gray-200 last:border-b-0 px-6 py-5">
      <div className="flex flex-col items-start gap-3 w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-4 bg-slate-300 rounded w-32"></div>
          <div className="h-4 bg-slate-300 rounded w-24"></div>
        </div>
        <div className="space-y-2 w-full">
          <div className="h-5 bg-slate-300 rounded w-3/4"></div>
          <div className="h-5 bg-slate-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

const TableRowSkeleton = ({ columns = 4, className = "" }) => {
  return (
    <div className={`animate-pulse flex items-center gap-4 p-4 ${className}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-slate-300 dark:bg-slate-600 rounded ${index === 0 ? 'w-16' : index === columns - 1 ? 'w-20' : 'flex-1'
            }`}
        ></div>
      ))}
    </div>
  );
};


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

const MessageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-start space-x-3 max-w-[80%]">
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="p-3 rounded-lg bg-gray-200 animate-pulse w-48 h-10"></div>
    </div>
    <div className="flex justify-end">
      <div className="flex items-start space-x-3 max-w-[80%] flex-row-reverse space-x-reverse">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="p-3 rounded-lg bg-gray-200 animate-pulse w-32 h-8"></div>
      </div>
    </div>
    <div className="flex items-start space-x-3 max-w-[80%]">
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="p-3 rounded-lg bg-gray-200 animate-pulse w-64 h-12"></div>
    </div>
  </div>
);

const TableSkeleton = ({ columns, rows = 5 }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead key={index} style={{ width: col.width }}>
              <Skeleton className="h-5 w-full" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

const MethodCardSkeleton = () => {
  return (
    <div className="pt-6"> 
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-6 w-[70px]" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-2 mt-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

const NewsTableSkeleton = ({ rows = 5 }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70%]"><Skeleton className="h-5 w-1/4" /></TableHead>
          <TableHead className="text-center"><Skeleton className="h-5 w-3/4 mx-auto" /></TableHead>
          <TableHead className="text-center"><Skeleton className="h-5 w-3/4 mx-auto" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-5 w-1/2 ml-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
            </TableCell>
            <TableCell><Skeleton className="h-5 w-3/4 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-5 w-3/4 mx-auto" /></TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ChatSkeleton = () => (
  <div className="flex h-screen bg-gray-50">
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-gray-100 animate-pulse">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex-1 p-4">
        <MessageSkeleton />
      </div>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-slate-300 dark:bg-slate-600 rounded ${index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
        ></div>
      ))}
    </div>
  );
};

const PageSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse p-6 ${className}`}>
      <div className="w-1/3 h-8 bg-slate-300 dark:bg-slate-600 rounded mb-6"></div>
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
      case "news":
        return <NewsSkeleton className={className} {...props} />;
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
  SpinnerLoading,
  NewsSkeleton,
  ChatSkeleton,
  MessageSkeleton,
  TableSkeleton,
  MethodCardSkeleton,
  NewsTableSkeleton
}; 