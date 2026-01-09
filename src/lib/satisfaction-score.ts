/**
 * Extract customer satisfaction score from call transcript
 * Analyzes sentiment, keywords, and conversation flow to determine satisfaction (0-100)
 */

import { type VAPICall } from './vapi'

interface CallLog {
  transcript?: any
  messages?: any
  summary?: string | null
  ended_reason?: string | null
}

/**
 * Calculate customer satisfaction score from CallLog (from database)
 * Returns a score from 0 to 100
 */
export function calculateSatisfactionScoreFromCallLog(callLog: CallLog): number {
  // Extract transcript text
  let allText = ''
  
  // Get text from transcript
  if (callLog.transcript) {
    if (Array.isArray(callLog.transcript)) {
      allText += callLog.transcript
        .map((msg: any) => msg.content || msg.text || JSON.stringify(msg))
        .join(' ')
    } else if (typeof callLog.transcript === 'string') {
      allText += callLog.transcript
    } else if (callLog.transcript.content) {
      allText += callLog.transcript.content
    }
  }
  
  // Get text from messages
  if (callLog.messages) {
    if (Array.isArray(callLog.messages)) {
      allText += ' ' + callLog.messages
        .map((msg: any) => msg.content || msg.text || JSON.stringify(msg))
    .join(' ')
    } else if (typeof callLog.messages === 'string') {
      allText += ' ' + callLog.messages
    }
  }
  
  // Add summary if available
  if (callLog.summary) {
    allText += ' ' + callLog.summary
  }
  
  allText = allText.toLowerCase().trim()
  
  if (!allText) {
    return 50 // Default neutral score if no content
  }
  
  return calculateScoreFromText(allText, callLog.ended_reason)
}

/**
 * Shared scoring logic for calculating satisfaction score from text
 */
function calculateScoreFromText(allText: string, endedReason?: string | null): number {
  // Positive indicators (increase score)
  const positiveKeywords = [
    'thank you', 'thanks', 'appreciate', 'great', 'excellent', 'perfect',
    'wonderful', 'amazing', 'helpful', 'satisfied', 'happy', 'pleased',
    'love it', 'exactly what', 'perfect solution', 'very good', 'good job',
    'exactly', 'yes please', 'that works', 'sounds good', 'perfect',
    'resolved', 'solved', 'fixed', 'understood', 'clear', 'makes sense'
  ]
  
  // Negative indicators (decrease score)
  const negativeKeywords = [
    'frustrated', 'angry', 'upset', 'disappointed', 'terrible', 'awful',
    'horrible', 'useless', 'waste of time', 'not helpful', 'confused',
    'doesn\'t work', 'broken', 'wrong', 'incorrect', 'no idea', 'unclear',
    'complicated', 'difficult', 'problem', 'issue', 'error', 'failed',
    'can\'t', 'cannot', 'won\'t work', 'not working', 'bad', 'poor'
  ]
  
  // Count positive and negative matches
  let positiveCount = 0
  let negativeCount = 0
  
  positiveKeywords.forEach(keyword => {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = allText.match(regex)
    if (matches) {
      positiveCount += matches.length
    }
  })
  
  negativeKeywords.forEach(keyword => {
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = allText.match(regex)
    if (matches) {
      negativeCount += matches.length
    }
  })
  
  // Calculate base score (start at 50 - neutral)
  let score = 50
  
  // Adjust based on keyword counts
  // Each positive keyword adds points, each negative subtracts
  score += positiveCount * 5
  score -= negativeCount * 8
  
  // Check for explicit satisfaction questions/answers
  const satisfactionPatterns = [
    /(?:rate|rating|satisfaction|satisfied|happy).*?(?:1|2|3|4|5|one|two|three|four|five|excellent|good|bad|poor)/gi,
    /(?:how.*?service|how.*?help|how.*?experience)/gi
  ]
  
  satisfactionPatterns.forEach(pattern => {
    if (pattern.test(allText)) {
      // If satisfaction is discussed, check the response
      if (allText.includes('excellent') || allText.includes('5') || allText.includes('five')) {
        score += 20
      } else if (allText.includes('good') || allText.includes('4') || allText.includes('four')) {
        score += 10
      } else if (allText.includes('bad') || allText.includes('poor') || allText.includes('1') || allText.includes('one')) {
        score -= 30
      }
    }
  })
  
  // Check call outcome
  const endedReasonLower = endedReason?.toLowerCase() || ''
  if (endedReasonLower.includes('transfer') || endedReasonLower.includes('forward')) {
    score -= 15 // Transfers might indicate dissatisfaction
  }
  
  // Check if call was resolved (positive indicator)
  if (allText.includes('resolved') || allText.includes('solved') || allText.includes('fixed')) {
    score += 10
  }
  
  // Normalize score to 0-100 range
  score = Math.max(0, Math.min(100, score))
  
  // Round to nearest integer
  return Math.round(score)
}

/**
 * Calculate customer satisfaction score from transcript
 * Returns a score from 0 to 100
 */
export function calculateSatisfactionScore(call: VAPICall): number {
  // Get all messages from transcript and messages
  const allMessages = [
    ...(call.transcript || []),
    ...(call.messages || [])
  ]
  
  if (allMessages.length === 0) {
    return 50 // Default neutral score if no transcript
  }
  
  // Extract all text content
  const allText = allMessages
    .map(msg => msg.content || '')
    .join(' ')
    .toLowerCase()
  
  if (!allText.trim()) {
    return 50 // Default if no content
  }
  
  return calculateScoreFromText(allText, call.endedReason)
}

