/**
 * Simple Markdown renderer for call summaries
 * Handles basic Markdown formatting without external dependencies
 */

import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null

  // Parse inline Markdown (bold, italic)
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return []
    
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let key = 0

    // Find all bold markers (**text**)
    const boldMatches: Array<{ start: number; end: number; content: string }> = []
    let match
    const boldRegex = /\*\*(.+?)\*\*/g
    
    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
      })
    }

    // Combine and sort all matches
    const allMatches = boldMatches
      .map((m) => ({ ...m, type: 'bold' as const }))
      .sort((a, b) => a.start - b.start)

    // Build React nodes
    allMatches.forEach((match) => {
      // Add text before match
      if (match.start > lastIndex) {
        const beforeText = text.substring(lastIndex, match.start)
        if (beforeText) {
          parts.push(<span key={`text-${key++}`}>{beforeText}</span>)
        }
      }

      // Add formatted content
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold">
          {match.content}
        </strong>
      )

      lastIndex = match.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex)
      if (remainingText) {
        parts.push(<span key={`text-${key++}`}>{remainingText}</span>)
      }
    }

    return parts.length > 0 ? parts : [<span key="text-0">{text}</span>]
  }

  // Simple Markdown parser for basic formatting
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let key = 0

    // Split by line breaks first
    const lines = text.split('\n')
    
    lines.forEach((line) => {
      if (line.trim() === '') {
        parts.push(<br key={`br-${key++}`} />)
        return
      }

      // Check if it's a list item (starts with - or *)
      const listMatch = line.match(/^[-*]\s+(.+)$/)
      if (listMatch) {
        const listContent = parseInlineMarkdown(listMatch[1])
        parts.push(
          <div key={`list-${key++}`} className="flex items-start gap-2 my-1.5">
            <span className="text-primary mt-1.5 flex-shrink-0">•</span>
            <div className="flex-1">{listContent}</div>
          </div>
        )
        return
      }

      // Regular paragraph
      const paragraphContent = parseInlineMarkdown(line.trim())
      parts.push(
        <p key={`p-${key++}`} className="mb-2 last:mb-0">
          {paragraphContent}
        </p>
      )
    })

    return parts
  }

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  )
}

