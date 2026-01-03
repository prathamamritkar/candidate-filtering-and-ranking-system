import { Empty } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import ResultsTable from "./results-table"

interface CandidateListProps {
  isLoading: boolean
  candidates: any[]
}

export function CandidateList({ isLoading, candidates }: CandidateListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Filtering and ranking candidates...</p>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="py-20">
        <Empty
          title="No candidates yet"
          description="Input a job description to see ranked candidates based on match score."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ResultsTable rankedCandidates={candidates} />
    </div>
  )
}
