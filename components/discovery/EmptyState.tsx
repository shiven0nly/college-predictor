import { FiSearch } from "react-icons/fi"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <FiSearch className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No colleges found</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        We couldn&apos;t find any colleges matching your current filters. Try adjusting your search criteria or resetting the filters.
      </p>
      {onClearFilters && (
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
