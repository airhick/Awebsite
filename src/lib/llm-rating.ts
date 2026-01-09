/**
 * LLM-based Call Rating Service
 * Uses free LLM APIs to provide detailed call ratings (1-100 scale)
 */

interface CallRatingResponse {
  score: number // 1-100
  reasoning: string // Detailed explanation of the rating
  strengths?: string[] // Key strengths of the call
  areasForImprovement?: string[] // Areas that could be improved
}

/**
 * Rate a call using a free LLM API (Hugging Face Inference API)
 * Returns a detailed rating on a scale from 1 to 100
 */
export async function rateCallWithLLM(
  transcript: string,
  summary?: string
): Promise<CallRatingResponse> {
  try {
    // Prepare the prompt
    const prompt = `You are an expert call quality analyst. Analyze the following customer service call and provide a detailed rating on a scale from 1 to 100.

${summary ? `Call Summary: ${summary}\n\n` : ''}Call Transcript:
${transcript}

Please provide:
1. A numerical score from 1 to 100 (where 100 is excellent and 1 is very poor)
2. Detailed reasoning explaining your rating
3. Key strengths of the call
4. Areas for improvement

Respond in JSON format:
{
  "score": <number 1-100>,
  "reasoning": "<detailed explanation>",
  "strengths": ["<strength1>", "<strength2>"],
  "areasForImprovement": ["<area1>", "<area2>"]
}`

    // Try multiple free LLM APIs as fallbacks
    // First try: Hugging Face Inference API (free for public models)
    let response: Response | null = null
    let text = ''
    
    try {
      response = await fetch(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        text = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || ''
        
        // Check if model is loading (common with Hugging Face free tier)
        if (data.error && data.error.includes('loading')) {
          throw new Error('Model is loading')
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.warn('Hugging Face API failed, trying fallback:', error)
      // Fall back to simple calculation
      return fallbackRating(transcript, summary)
    }

    if (!text) {
      return fallbackRating(transcript, summary)
    }

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          score: Math.max(1, Math.min(100, Math.round(parsed.score || 50))),
          reasoning: parsed.reasoning || 'Analysis completed',
          strengths: parsed.strengths || [],
          areasForImprovement: parsed.areasForImprovement || [],
        }
      } catch (e) {
        console.warn('Failed to parse LLM JSON response', e)
      }
    }

    // If JSON parsing fails, try to extract score from text
    const scoreMatch = text.match(/score["\s:]*(\d+)/i) || text.match(/(\d+)\s*(?:out of|from|on a scale)/i)
    const extractedScore = scoreMatch ? parseInt(scoreMatch[1], 10) : null

    return {
      score: extractedScore ? Math.max(1, Math.min(100, extractedScore)) : 50,
      reasoning: text.substring(0, 500) || 'LLM analysis completed',
      strengths: [],
      areasForImprovement: [],
    }
  } catch (error) {
    console.error('Error calling LLM API:', error)
    // Fallback to simple calculation
    return fallbackRating(transcript, summary)
  }
}

/**
 * Fallback rating calculation when LLM API is unavailable
 */
function fallbackRating(transcript: string, summary?: string): CallRatingResponse {
  const text = `${summary || ''} ${transcript}`.toLowerCase()

  // Simple keyword-based scoring
  let score = 50 // Start neutral

  // Positive indicators
  const positivePatterns = [
    /\b(thank you|thanks|appreciate|great|excellent|perfect|wonderful|amazing|helpful|satisfied|happy|pleased|resolved|solved|fixed|understood|clear)\b/gi,
  ]
  const positiveMatches = positivePatterns.reduce((count, pattern) => {
    const matches = text.match(pattern)
    return count + (matches ? matches.length : 0)
  }, 0)

  // Negative indicators
  const negativePatterns = [
    /\b(frustrated|angry|upset|disappointed|terrible|awful|horrible|useless|confused|broken|wrong|incorrect|problem|issue|error|failed|bad|poor)\b/gi,
  ]
  const negativeMatches = negativePatterns.reduce((count, pattern) => {
    const matches = text.match(pattern)
    return count + (matches ? matches.length : 0)
  }, 0)

  score += positiveMatches * 3
  score -= negativeMatches * 5

  // Normalize to 1-100
  score = Math.max(1, Math.min(100, score))

  return {
    score: Math.round(score),
    reasoning: `Based on keyword analysis: Found ${positiveMatches} positive indicators and ${negativeMatches} negative indicators.`,
    strengths: positiveMatches > 0 ? ['Positive customer interactions detected'] : [],
    areasForImprovement: negativeMatches > 0 ? ['Some negative sentiment detected'] : [],
  }
}

