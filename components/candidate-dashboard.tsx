"use client"

import { useState } from "react"
import { JobDescriptionInput } from "@/components/job-description-input"
import CandidateUpload from "@/components/candidate-upload"
import { CandidateList } from "@/components/candidate-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sparkles, ArrowRight, Upload } from "lucide-react"
import type { Candidate } from "@/types/candidate"

export function CandidateDashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputCandidates, setInputCandidates] = useState<any[]>([])
  const [rankedCandidates, setRankedCandidates] = useState<any[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minExperience, setMinExperience] = useState<number | undefined>(undefined)
  const [locations, setLocations] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState<number | undefined>(undefined)
  const [salaryMax, setSalaryMax] = useState<number | undefined>(undefined)

  const rankCandidates = async () => {
    if (!inputCandidates.length) return
    setIsProcessing(true)
    try {
      const resp = await fetch("/api/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          filters: { selectedSkills, minExperience, locations, salaryMax },
          candidates: inputCandidates,
        }),
      })
      const data = await resp.json()
      setRankedCandidates(data.results || [])
      setCurrentStep(4)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const loadAllSampleData = () => {
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
    setJobDescription(sampleJD)

    setSelectedSkills(["React", "TypeScript"])
    setMinExperience(3)
    setLocations(["Remote", "New York"])
    setSalaryMin(100000)
    setSalaryMax(150000)

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
        resumeText: "Experienced full-stack developer with 5 years building scalable web applications. Proficient in React, TypeScript, and Node.js. Led development of microservices architecture serving 1M+ users. AWS certified with hands-on experience in serverless technologies.",
      },
      {
        id: "2",
        name: "Jane Smith",
        yearsOfExperience: 8,
        education: "Master's in Software Engineering",
        location: "New York, NY",
        skills: ["Python", "Django", "React", "PostgreSQL", "AWS"],
        certifications: ["Google Cloud Professional"],
        visaStatus: "Work Authorization",
        salaryExpectation: 160000,
        resumeText: "Senior software engineer with 8 years of experience in Python and React. Architected high-performance systems handling millions of transactions. Strong background in database optimization and cloud infrastructure. Google Cloud certified professional.",
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
        resumeText: "Junior developer with 3 years focused on Vue.js and Node.js. Built modern SPAs with responsive UI/UX. Strong foundation in JavaScript ES6+ and RESTful API development. Eager to learn new technologies and grow technical skills.",
      },
      {
        id: "4",
        name: "Sarah Williams",
        yearsOfExperience: 6,
        education: "Bachelor's in Computer Science",
        location: "Remote",
        skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "GraphQL"],
        certifications: ["AWS Solutions Architect"],
        visaStatus: "US Citizen",
        salaryExpectation: 145000,
        resumeText: "Full-stack engineer with 6 years specializing in React and TypeScript. Expert in containerized deployments with Docker and Kubernetes. Built GraphQL APIs serving enterprise clients. AWS Solutions Architect certified with deep cloud expertise.",
      },
    ]
    setInputCandidates(sampleCandidates)
    setCurrentStep(1)
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-7xl">
      <header className="flex flex-col gap-6 mb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Candidate Filtering & Ranking</h1>
            <p className="text-muted-foreground text-pretty">
              Extract requirements from job descriptions and rank candidates automatically.
            </p>
          </div>
          <Button onClick={loadAllSampleData} variant="outline" size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Load Sample Data
          </Button>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { num: 1, label: "Job Description" },
            { num: 2, label: "Upload Candidates" },
            { num: 3, label: "Recruiter Filters" },
            { num: 4, label: "Results" },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 transition-colors ${
                  currentStep === step.num
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : currentStep > step.num
                      ? "border-green-500 bg-green-50 text-green-700 cursor-pointer hover:bg-green-100"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
                disabled={currentStep < step.num}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-current/10 text-sm font-bold">
                  {step.num}
                </span>
                <span className="text-sm">{step.label}</span>
              </button>
              {idx < 3 && <ArrowRight className="text-gray-300" />}
            </div>
          ))}
        </div>
      </header>

      {currentStep === 1 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Step 1: Enter Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-48 p-3 border rounded-md font-mono text-sm resize-none"
              />
            </div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!jobDescription.trim()}
              size="lg"
              className="w-full gap-2"
            >
              Next: Upload Candidates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Step 2: Upload Candidates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Candidate Data (JSON)</label>
              <textarea
                placeholder='[{"name": "John Doe", "yearsOfExperience": 5, "skills": ["React", "TypeScript"], ...}]'
                value={inputCandidates.length > 0 ? JSON.stringify(inputCandidates, null, 2) : ""}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setInputCandidates(Array.isArray(parsed) ? parsed : [parsed])
                  } catch {}
                }}
                className="w-full h-64 p-3 border rounded-md font-mono text-xs resize-none"
              />
            </div>
            {inputCandidates.length > 0 && (
              <div className="text-sm text-green-600 font-medium">
                ✓ {inputCandidates.length} candidate(s) loaded
              </div>
            )}
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!inputCandidates.length}
              size="lg"
              className="w-full gap-2"
            >
              Next: Set Recruiter Filters
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Step 3: Recruiter Filters (Optional)</CardTitle>
          </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Min Experience (years)</label>
                    <span className="text-sm font-semibold text-primary">{minExperience ?? 0}+</span>
                  </div>
                  <Slider
                    value={[minExperience ?? 0]}
                    onValueChange={(value) => setMinExperience(value[0])}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Skills (multi-select)</label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    {["React", "TypeScript", "Node.js", "Python", "AWS", "SQL", "Docker", "GraphQL", "Vue.js", "Angular"].map((skill) => (
                      <label key={skill} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills([...selectedSkills, skill])
                            } else {
                              setSelectedSkills(selectedSkills.filter((s) => s !== skill))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSkills.map((skill) => (
                        <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Locations (multi-select)</label>
                  <div className="border rounded-md p-3">
                    {["Remote", "New York", "San Francisco", "Austin", "Seattle", "Boston"].map((loc) => (
                      <label key={loc} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={locations.includes(loc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocations([...locations, loc])
                            } else {
                              setLocations(locations.filter((l) => l !== loc))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{loc}</span>
                      </label>
                    ))}
                  </div>
                  {locations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {locations.map((loc) => (
                        <span key={loc} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                          {loc}
                          <button
                            onClick={() => setLocations(locations.filter((l) => l !== loc))}
                            className="hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Salary Range</label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        className="w-full rounded border px-3 py-2"
                        value={salaryMin ?? ""}
                        onChange={(e) => setSalaryMin(e.target.value ? Number(e.target.value) : undefined)}
                        min={0}
                        placeholder="Min (e.g., 100000)"
                      />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        className="w-full rounded border px-3 py-2"
                        value={salaryMax ?? ""}
                        onChange={(e) => setSalaryMax(e.target.value ? Number(e.target.value) : undefined)}
                        min={0}
                        placeholder="Max (e.g., 150000)"
                      />
                    </div>
                  </div>
                  {(salaryMin || salaryMax) && (
                    <div className="text-xs text-gray-600 mt-1">
                      ${salaryMin?.toLocaleString() || '0'} - ${salaryMax?.toLocaleString() || '∞'}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={rankCandidates}
                disabled={!inputCandidates.length || isProcessing}
                size="lg"
                className="w-full gap-2"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    Rank Candidates
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Step 4: Ranked Candidates</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CandidateList isLoading={isProcessing} candidates={rankedCandidates} />
            <div className="mt-6 flex gap-3">
              <Button onClick={() => setCurrentStep(3)} variant="outline" className="gap-2">
                ← Back to Filters
              </Button>
              <Button onClick={() => { setCurrentStep(1); setRankedCandidates([]); }} variant="outline" className="gap-2">
                Start New Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
