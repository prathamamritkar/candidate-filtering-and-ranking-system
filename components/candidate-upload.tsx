"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Play } from "lucide-react"
import { useState } from "react"
import type { Candidate } from "@/types/candidate"

interface CandidateUploadProps {
  candidates: Candidate[]
  onChange: (candidates: Candidate[]) => void
  onApplyFilters: () => void
}

export default function CandidateUpload({ candidates, onChange, onApplyFilters }: CandidateUploadProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")

  const handleUpload = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const candidateArray = Array.isArray(parsed) ? parsed : [parsed]
      onChange(candidateArray)
      setError("")
    } catch (err) {
      setError("Invalid JSON format. Please check your input.")
    }
  }

  const loadSampleData = () => {
    const sampleCandidates: Candidate[] = [
      {
        id: "1",
        name: "John Doe",
        yearsOfExperience: 5,
        education: "Bachelor's in Computer Science",
        location: "San Francisco, CA",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        certifications: ["AWS Certified Developer"],
        visaStatus: "US Citizen",
        salaryExpectation: 140000,
        resumeText: "Experienced full-stack developer with 5 years building scalable web applications.",
      },
      {
        id: "2",
        name: "Jane Smith",
        yearsOfExperience: 8,
        education: "Master's in Software Engineering",
        location: "New York, NY",
        skills: ["Python", "Django", "React", "PostgreSQL"],
        certifications: ["Google Cloud Professional"],
        visaStatus: "Work Authorization",
        salaryExpectation: 160000,
        resumeText: "Senior software engineer with 8 years of experience in Python and React.",
      },
      {
        id: "3",
        name: "Mike Johnson",
        yearsOfExperience: 3,
        education: "Bachelor's in Information Technology",
        location: "Austin, TX",
        skills: ["JavaScript", "Vue.js", "Node.js"],
        certifications: [],
        visaStatus: "US Citizen",
        salaryExpectation: 110000,
        resumeText: "Junior developer with 3 years focused on Vue.js and Node.js.",
      },
    ]
    onChange(sampleCandidates)
    setJsonInput(JSON.stringify(sampleCandidates, null, 2))
    setError("")
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="candidate-json" className="text-base font-semibold">
          Candidate Data (JSON)
        </Label>
        <p className="text-sm text-slate-600 mb-2">Upload candidate data in JSON format or use sample data to test</p>
        <Textarea
          id="candidate-json"
          placeholder={
            '[{"name": "John Doe", "yearsOfExperience": 5, "education": "Bachelor\'s", "skills": ["JavaScript", "React"], "location": "San Francisco, CA"}]'
          }
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="min-h-[200px] font-mono text-xs"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {candidates.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong>{candidates.length} candidate(s) loaded</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={handleUpload} variant="outline" className="flex-1 bg-transparent">
          <Upload className="mr-2 h-4 w-4" />
          Load Candidates
        </Button>
        <Button onClick={loadSampleData} variant="outline" className="flex-1 bg-transparent">
          Load Sample Data
        </Button>
      </div>

      <Button onClick={onApplyFilters} disabled={candidates.length === 0} className="w-full" size="lg">
        <Play className="mr-2 h-4 w-4" />
        Apply Filters & Rank Candidates
      </Button>
    </div>
  )
}
