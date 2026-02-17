import sanitizeHtml from 'sanitize-html'

export type InstructionsLengthMode = 'throw' | 'truncate'

export type SanitizePaymentRequestInstructionsOptions = {
  maxLength?: number
  lengthMode?: InstructionsLengthMode
}

const DEFAULT_MAX_LENGTH = 20_000

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function mergeRel(currentRel: string | undefined, addRel: string): string {
  const existing = (currentRel || '')
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const toAdd = addRel
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return Array.from(new Set([...existing, ...toAdd])).join(' ')
}

function looksLikeHtml(input: string): boolean {
  // Small heuristic: if it contains an HTML tag-like pattern, treat it as HTML.
  return /<\s*\/?\s*[a-z][\s\S]*?>/i.test(input)
}

/**
 * Sanitizes user-provided instructions while still allowing a safe subset of HTML.
 * - Strips scripts, event handlers, and unsafe URL schemes.
 * - If content is plain text, it is escaped and newlines become <br/>.
 */
export function sanitizePaymentRequestInstructionsContent(
  raw: unknown,
  options: SanitizePaymentRequestInstructionsOptions = {}
): string | null {
  if (raw === null || raw === undefined) {
    return null
  }

  let rawString = String(raw)
  if (!rawString.trim()) {
    return null
  }

  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH
  const lengthMode: InstructionsLengthMode = options.lengthMode ?? 'throw'

  if (rawString.length > maxLength) {
    if (lengthMode === 'truncate') {
      rawString = rawString.slice(0, maxLength)
    } else {
      throw new Error(`instructions_content exceeds max length (${maxLength})`)
    }
  }

  if (!looksLikeHtml(rawString)) {
    return escapeHtml(rawString).replace(/\r\n|\r|\n/g, '<br/>')
  }

  return sanitizeHtml(rawString, {
    allowedTags: [
      'a',
      'abbr',
      'b',
      'blockquote',
      'br',
      'caption',
      'code',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'span',
      'strong',
      'sub',
      'sup',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'u',
      'ul'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      table: ['border', 'cellpadding', 'cellspacing'],
      td: ['colspan', 'rowspan', 'align', 'valign'],
      th: ['colspan', 'rowspan', 'align', 'valign'],
      '*': ['class', 'id']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target
        const nextAttribs = { ...attribs }
        if (target && target.toLowerCase() === '_blank') {
          nextAttribs.rel = mergeRel(nextAttribs.rel, 'noopener noreferrer nofollow')
        }
        return { tagName, attribs: nextAttribs }
      }
    }
  })
}
