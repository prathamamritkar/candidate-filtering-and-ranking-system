"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Sparkles, FileText } from "lucide-react"
import type { JobRequirements } from "@/types/candidate"

export interface JobDescriptionInputProps {
  value?: string
  onChange?: (value: string) => void
  onExtract?: () => void
  extractedRequirements?: JobRequirements | null
  onProcess?: () => void
}

export function JobDescriptionInput({
  value = "",
  onChange = () => {},
  onExtract = () => {},
  extractedRequirements = null,
  onProcess,
}: JobDescriptionInputProps) {
  const loadSampleJobDescription = () => {
    const sampleJD = `Senior Full Stack Developer

We are seeking an experienced Full Stack Developer to join our growing engineering team.

Required Qualifications:
- 5+ years of professional software development experience
- Strong proficiency in React and TypeScript
- Experience with Node.js and backend development
- Solid understanding of AWS cloud services
- Bachelor's degree in Computer Science or related field

Preferred Skills:
- Python for data processing
- SQL and database design
- Docker and containerization
- GraphQL API development

Location: Remote or New York, NY
Salary Range: $120,000 - $160,000`
    onChange(sampleJD)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-description" className="text-base font-semibold">
          Job Description
        </Label>
        <p className="text-sm text-slate-600 mb-2">Paste the job description to extract requirements automatically</p>
        <Textarea
          id="job-description"
          placeholder="Enter job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
      </div>

      {extractedRequirements && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Requirements extracted successfully!</strong>
            <div className="mt-2 space-y-1 text-sm">
              {extractedRequirements.minExperience !== undefined && (
                <div>Minimum Experience: {extractedRequirements.minExperience} years</div>
              )}
              {extractedRequirements.requiredSkills && extractedRequirements.requiredSkills.length > 0 && (
                <div>Required Skills: {extractedRequirements.requiredSkills.join(", ")}</div>
              )}
              {extractedRequirements.preferredSkills && extractedRequirements.preferredSkills.length > 0 && (
                <div>Preferred Skills: {extractedRequirements.preferredSkills.join(", ")}</div>
              )}
              {extractedRequirements.location && <div>Location: {extractedRequirements.location}</div>}
              {extractedRequirements.salaryRange && (
                <div>Salary Range: ${extractedRequirements.salaryRange.min?.toLocaleString() || '?'} - ${extractedRequirements.salaryRange.max?.toLocaleString() || '?'}</div>
              )}
              {extractedRequirements.education && <div>Education: {extractedRequirements.education}</div>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={loadSampleJobDescription}
          variant="outline"
          className="flex-1"
        >
          <FileText className="mr-2 h-4 w-4" />
          Load Sample
        </Button>
        <Button
          onClick={() => {
            onExtract()
            onProcess?.()
          }}
          disabled={!value.trim()}
          className="flex-1"
          size="lg"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Extract Requirements
        </Button>
      </div>
    </div>
  )
}

export default JobDescriptionInput
