export interface JobRequirements {
  minExperience: number
  requiredSkills: string[]
  preferredSkills: string[]
  education?: string
  certifications?: string[]
  location?: string
  salaryRange?: { min?: number; max?: number }
}

export interface RecruiterFilters {
  weightExperience?: number
  weightSkills?: number
  weightEducation?: number
  remoteOnly?: boolean
  visaRequired?: boolean
  selectedSkills?: string[]
  minExperience?: number
  locations?: string[]
  salaryMax?: number
}

export interface Candidate {
  id: string
  name: string
  yearsOfExperience: number
  education: string
  location: string
  skills: string[]
  certifications: string[]
  visaStatus: string
  salaryExpectation?: number
  resumeText?: string
}

export interface RankedCandidate extends Candidate {
  score: number
  matchReasons: string[]
}
