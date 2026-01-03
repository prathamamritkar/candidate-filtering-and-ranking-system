"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { RankedCandidate } from "@/types/candidate"
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus, LayoutGrid, Table2 } from "lucide-react"

interface ResultsTableProps {
  rankedCandidates: RankedCandidate[]
}

export default function ResultsTable({ rankedCandidates }: ResultsTableProps) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const getExperienceFitStatus = (candidate: RankedCandidate) => {
    const matchReason = candidate.matchReasons.find((r) => r.includes("experience"))
    if (matchReason?.includes("Meets experience")) {
      return { status: "Exceeds", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" }
    }
    if (matchReason?.includes("Below required")) {
      return { status: "Below", icon: TrendingDown, color: "text-orange-600", bg: "bg-orange-50" }
    }
    return { status: "Meets", icon: Minus, color: "text-blue-600", bg: "bg-blue-50" }
  }

  const extractSkills = (candidate: RankedCandidate) => {
    const matched: string[] = []
    const missing: string[] = []

    candidate.matchReasons.forEach((reason) => {
      if (reason.startsWith("Required skills:")) {
        matched.push(...reason.replace("Required skills:", "").split(",").map((s) => s.trim()))
      }
      if (reason.startsWith("Preferred skills:")) {
        matched.push(...reason.replace("Preferred skills:", "").split(",").map((s) => s.trim()))
      }
      if (reason.startsWith("Missing required:")) {
        missing.push(...reason.replace("Missing required:", "").split(",").map((s) => s.trim()))
      }
    })

    return { matched, missing }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {rankedCandidates.length} ranked candidate{rankedCandidates.length !== 1 ? "s" : ""}
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>
      
      {viewMode === "cards" ? (
        <div className="space-y-3">{rankedCandidates.map((candidate, index) => {
          const expFit = getExperienceFitStatus(candidate)
          const { matched, missing } = extractSkills(candidate)
          const pct = Math.round((candidate.score ?? 0) * 100)

          return (
            <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">
                      {candidate.education} • {candidate.location}
                    </p>
                  </div>
                </div>
                <Badge variant={pct > 70 ? "default" : "secondary"} className="text-base px-3 py-1 shrink-0">
                  {pct}%
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className={`flex items-center gap-2 p-2 rounded ${expFit.bg}`}>
                  <expFit.icon className={`h-4 w-4 ${expFit.color} shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600">Experience</div>
                    <div className={`font-semibold text-sm ${expFit.color}`}>
                      {candidate.yearsOfExperience}y ({expFit.status})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600">Salary</div>
                    <div className="font-semibold text-sm text-gray-900">
                      ${candidate.salaryExpectation ? candidate.salaryExpectation.toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600">Score</div>
                    <div className="font-semibold text-sm text-gray-900">{candidate.score.toFixed(3)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {matched.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Matched Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matched.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {missing.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Missing Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missing.map((skill, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Rank</TableHead>
                <TableHead className="w-32">Name</TableHead>
                <TableHead className="w-28">Experience</TableHead>
                <TableHead className="w-32">Skills Match</TableHead>
                <TableHead className="w-56">Education</TableHead>
                <TableHead className="w-40">Location</TableHead>
                <TableHead className="w-32">Salary</TableHead>
                <TableHead className="w-24 text-center">Score</TableHead>
                <TableHead className="min-w-[300px]">Match Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedCandidates.map((candidate, index) => {
                const expFit = getExperienceFitStatus(candidate)
                const { matched, missing } = extractSkills(candidate)
                const pct = Math.round((candidate.score ?? 0) * 100)

                return (
                  <TableRow key={candidate.id}>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <expFit.icon className={`h-3.5 w-3.5 ${expFit.color} flex-shrink-0`} />
                        <span className="text-sm whitespace-nowrap">{candidate.yearsOfExperience}y</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {matched.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-green-700">
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{matched.length} matched</span>
                          </div>
                        )}
                        {missing.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-red-700">
                            <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{missing.length} missing</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{candidate.education}</TableCell>
                    <TableCell className="text-sm">{candidate.location}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {candidate.salaryExpectation 
                        ? `$${candidate.salaryExpectation.toLocaleString()}`
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={pct > 70 ? "default" : "secondary"} className="font-semibold">
                        {pct}%
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="max-h-20 overflow-y-auto scrollbar-hide pr-2">
                        <div className="space-y-0.5 text-xs leading-relaxed">
                          {candidate.matchReasons.map((reason, i) => (
                            <div key={i} className="text-gray-700">
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
