"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function CandidateFilters() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="experience">Min. Experience (Years)</Label>
          <span className="text-sm font-medium">2+</span>
        </div>
        <Slider id="experience" defaultValue={[2]} max={15} step={1} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="remote" className="flex flex-col gap-1">
          <span>Remote Only</span>
          <span className="text-xs font-normal text-muted-foreground">Show only remote candidates</span>
        </Label>
        <Switch id="remote" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="relocation" className="flex flex-col gap-1">
          <span>Relocation Open</span>
          <span className="text-xs font-normal text-muted-foreground">Willing to relocate</span>
        </Label>
        <Switch id="relocation" />
      </div>
    </div>
  )
}
