/**
 * Circular Satisfaction Gauge Component
 * Displays a customer satisfaction score (0-100) as a circular progress indicator
 * Supports hover tooltip and click dialog for detailed ratings
 */

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { rateCallWithLLM } from '@/lib/llm-rating'

interface SatisfactionGaugeProps {
  score: number // 0-100
  size?: number // Size in pixels (default: 60)
  className?: string
  showLabel?: boolean
  transcript?: string // Optional transcript for detailed rating
  summary?: string // Optional summary for detailed rating
  interactive?: boolean // Enable hover and click interactions
}

export function SatisfactionGauge({ 
  score, 
  size = 60, 
  className,
  showLabel = false,
  transcript,
  summary,
  interactive = false
}: SatisfactionGaugeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailedRating, setDetailedRating] = useState<any>(null)
  const [isLoadingRating, setIsLoadingRating] = useState(false)

  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, score))
  
  // Calculate color based on score
  const getColor = (score: number): string => {
    if (score >= 80) return '#10b981' // Green for high satisfaction
    if (score >= 60) return '#3b82f6' // Blue for good satisfaction
    if (score >= 40) return '#f59e0b' // Orange for moderate satisfaction
    return '#ef4444' // Red for low satisfaction
  }
  
  const color = getColor(clampedScore)
  
  // Calculate stroke-dasharray for circular progress
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference
  
  const handleClick = async () => {
    if (!interactive || !transcript) return
    
    setIsDialogOpen(true)
    
    // If we already have detailed rating, don't fetch again
    if (detailedRating) return
    
    setIsLoadingRating(true)
    try {
      const rating = await rateCallWithLLM(transcript, summary)
      setDetailedRating(rating)
    } catch (error) {
      console.error('Failed to get detailed rating:', error)
    } finally {
      setIsLoadingRating(false)
    }
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Moderate'
    return 'Poor'
  }

  const gaugeElement = (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center",
        interactive && transcript && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={handleClick}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-sm font-bold"
          style={{ color }}
        >
          {Math.round(clampedScore)}
        </span>
      </div>
      {/* Optional label below */}
      {showLabel && (
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
          Satisfaction
        </div>
      )}
    </div>
  )

  // If interactive, wrap with tooltip and dialog
  if (interactive && transcript) {
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            {gaugeElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>Click for detailed rating analysis</p>
          </TooltipContent>
        </Tooltip>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detailed Call Rating Analysis</DialogTitle>
              <DialogDescription>
                AI-powered analysis of call quality and customer satisfaction
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingRating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Analyzing call...</span>
              </div>
            ) : detailedRating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold" style={{ color }}>
                    {detailedRating.score}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{getScoreLabel(detailedRating.score)}</div>
                    <div className="text-sm text-muted-foreground">Out of 100</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reasoning</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {detailedRating.reasoning}
                  </p>
                </div>

                {detailedRating.strengths && detailedRating.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {detailedRating.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailedRating.areasForImprovement && detailedRating.areasForImprovement.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {detailedRating.areasForImprovement.map((area: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Click the gauge to load detailed analysis
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return gaugeElement
}

