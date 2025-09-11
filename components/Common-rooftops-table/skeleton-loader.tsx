interface SkeletonLoaderProps {
  rows?: number
  columns?: number
}

export function SkeletonLoader({ rows = 10, columns = 31 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-3 py-2 border-r border-gray-100 h-9">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function InfiniteScrollSkeleton() {
  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          <span className="text-sm">Loading more results...</span>
        </div>
      </div>
    </div>
  )
}
