import { NextResponse } from "next/server"
import { extractRequirements, filterAndRankCandidates } from "@/lib/candidate-engine"
import type { Candidate, RecruiterFilters } from "@/types/candidate"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const jobDescription: string = body.jobDescription || ""
    const filters: RecruiterFilters = body.filters || {}
    const candidates: Candidate[] = body.candidates || []

    if (!Array.isArray(candidates)) {
      return NextResponse.json({ error: "Candidates must be an array" }, { status: 400 })
    }

    if (candidates.length === 0) {
      return NextResponse.json({ results: [], message: "No candidates provided" })
    }

    const requirements = extractRequirements(jobDescription)
    const ranked = filterAndRankCandidates(candidates, requirements, filters, jobDescription)

    return NextResponse.json({
      results: ranked,
      total: candidates.length,
      filtered: ranked.length,
      requirements,
    })
  } catch (err: any) {
    console.error("API Error:", err)
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 })
  }
}
