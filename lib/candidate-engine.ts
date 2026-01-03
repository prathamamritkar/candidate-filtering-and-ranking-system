import type { Candidate, JobRequirements, RecruiterFilters, RankedCandidate } from "@/types/candidate"

export function extractRequirements(jobDescription: string): JobRequirements {
  const skillsPool = ["React", "TypeScript", "Node.js", "Python", "AWS", "SQL", "Docker", "Kubernetes", "GraphQL", "JavaScript", "PostgreSQL", "MongoDB", "Redis", "Vue.js", "Angular"]
  
  const requiredSkills: string[] = []
  const preferredSkills: string[] = []
  
  const lines = jobDescription.split('\n')
  let isRequiredSection = false
  let isPreferredSection = false
  
  for (const line of lines) {
    const lower = line.toLowerCase()
    
    if (lower.includes('required') && (lower.includes('skill') || lower.includes('qualification') || lower.includes('experience'))) {
      isRequiredSection = true
      isPreferredSection = false
      continue
    }
    
    if (lower.includes('preferred') || lower.includes('nice to have') || lower.includes('bonus')) {
      isPreferredSection = true
      isRequiredSection = false
      continue
    }
    
    if (lower.includes('responsibilities') || lower.includes('about') || lower.includes('location') || lower.includes('salary')) {
      isRequiredSection = false
      isPreferredSection = false
    }
    
    const foundInLine = skillsPool.filter((skill) => new RegExp(skill, "i").test(line))
    
    if (isRequiredSection) {
      foundInLine.forEach(skill => {
        if (!requiredSkills.includes(skill)) requiredSkills.push(skill)
      })
    } else if (isPreferredSection) {
      foundInLine.forEach(skill => {
        if (!preferredSkills.includes(skill) && !requiredSkills.includes(skill)) preferredSkills.push(skill)
      })
    }
  }
  
  if (requiredSkills.length === 0) {
    const allFoundSkills = skillsPool.filter((skill) => new RegExp(skill, "i").test(jobDescription))
    requiredSkills.push(...allFoundSkills.slice(0, Math.ceil(allFoundSkills.length / 2)))
    preferredSkills.push(...allFoundSkills.slice(Math.ceil(allFoundSkills.length / 2)))
  }
  
  const expMatch = jobDescription.match(/(\d+)\+?\s*years?/i)
  const minExperience = expMatch ? Number.parseInt(expMatch[1]) : 2
  
  const locationMatch = jobDescription.match(/location:?\s*([^\n]+)/i)
  const location = locationMatch ? locationMatch[1].trim() : undefined
  
  const salaryMatch = jobDescription.match(/\$([\d,]+)(?:\s*-\s*\$?([\d,]+))?/)
  const salaryRange = salaryMatch ? {
    min: salaryMatch[1] ? parseInt(salaryMatch[1].replace(/,/g, '')) : undefined,
    max: salaryMatch[2] ? parseInt(salaryMatch[2].replace(/,/g, '')) : undefined,
  } : undefined
  
  return {
    minExperience,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ["JavaScript"],
    preferredSkills,
    education: jobDescription.toLowerCase().includes("bachelor") ? "Bachelor's" : "Not specified",
    location,
    salaryRange,
  }
}

export function filterAndRankCandidates(
  candidates: Candidate[],
  requirements: JobRequirements,
  filters: RecruiterFilters,
  jobDescription?: string,
): RankedCandidate[] {
  const minExp = filters.minExperience ?? requirements.minExperience

  const passed = candidates.filter((c) => {
    if (typeof c.yearsOfExperience !== "number") return false
    if (c.yearsOfExperience < minExp) return false

    if (filters.selectedSkills && filters.selectedSkills.length > 0) {
      const hasRequiredSkills = filters.selectedSkills.every((reqSkill) =>
        c.skills.some((candidateSkill) => candidateSkill.toLowerCase().includes(reqSkill.toLowerCase())),
      )
      if (!hasRequiredSkills) return false
    }

    if (filters.locations && filters.locations.length > 0) {
      const matchedLocation = filters.locations.some((loc) =>
        c.location.toLowerCase().includes(loc.toLowerCase()),
      )
      if (!matchedLocation) return false
    }

    if (typeof filters.salaryMax === "number" && typeof c.salaryExpectation === "number") {
      if (c.salaryExpectation > filters.salaryMax) return false
    }

    return true
  })

  if (passed.length === 0) return []

  const weightSkills = filters.weightSkills ?? 0.5
  const weightExperience = filters.weightExperience ?? 0.25
  const weightEducation = filters.weightEducation ?? 0.1
  const weightResume = 0.15
  const weightSum = weightSkills + weightExperience + weightEducation + weightResume

  const results = passed.map((candidate) => {
    const matchReasons: string[] = []

    const matchedRequiredSkills = candidate.skills.filter((skill) =>
      requirements.requiredSkills.some((req) => skill.toLowerCase().includes(req.toLowerCase())),
    )
    const missingRequiredSkills = requirements.requiredSkills.filter(
      (req) => !candidate.skills.some((s) => s.toLowerCase().includes(req.toLowerCase())),
    )
    
    const matchedPreferredSkills = candidate.skills.filter((skill) =>
      requirements.preferredSkills.some((req) => skill.toLowerCase().includes(req.toLowerCase())),
    )
    
    const requiredSkillScore = requirements.requiredSkills.length > 0 
      ? matchedRequiredSkills.length / requirements.requiredSkills.length 
      : 0
    
    const preferredSkillScore = requirements.preferredSkills.length > 0
      ? matchedPreferredSkills.length / requirements.preferredSkills.length
      : 0
    
    const skillScore = (requiredSkillScore * 0.7) + (preferredSkillScore * 0.3)
    
    if (matchedRequiredSkills.length > 0) matchReasons.push(`Required skills: ${matchedRequiredSkills.join(", ")}`)
    if (missingRequiredSkills.length > 0) matchReasons.push(`Missing required: ${missingRequiredSkills.join(", ")}`)
    if (matchedPreferredSkills.length > 0) matchReasons.push(`Preferred skills: ${matchedPreferredSkills.join(", ")}`)

    const experienceScore = candidate.yearsOfExperience >= minExp ? 1 : candidate.yearsOfExperience / minExp
    matchReasons.push(
      experienceScore >= 1
        ? `Meets experience (${candidate.yearsOfExperience} yrs)`
        : `Below required experience (${candidate.yearsOfExperience} yrs)`,
    )

    const educationScore = requirements.education && candidate.education
      ? candidate.education.toLowerCase().includes(requirements.education.toLowerCase())
        ? 1
        : 0
      : 0
    if (educationScore === 1) matchReasons.push(`Meets education: ${candidate.education}`)

    let resumeScore = 0
    if (candidate.resumeText && jobDescription) {
      const resumeLower = candidate.resumeText.toLowerCase()
      const jdLower = jobDescription.toLowerCase()
      
      const jdWords = jdLower.split(/\s+/).filter((w: string) => w.length > 4)
      const uniqueJdWords = [...new Set(jdWords)]
      
      const matchingWords = uniqueJdWords.filter((word: string) => resumeLower.includes(word))
      resumeScore = uniqueJdWords.length > 0 ? matchingWords.length / uniqueJdWords.length : 0
      
      if (resumeScore > 0.5) {
        matchReasons.push(`High resume match (${Math.round(resumeScore * 100)}%)`)
      }
    }

    const rawScore = skillScore * weightSkills + experienceScore * weightExperience + educationScore * weightEducation + resumeScore * weightResume

    const normalized = weightSum > 0 ? rawScore / weightSum : 0

    return {
      ...candidate,
      score: Math.round(normalized * 1000) / 1000,
      matchReasons,
    }
  })

  results.sort((a, b) => b.score - a.score)
  return results
}
