import { TONE_COLORS, StatusChipTone } from './status-chip.styles'

/**
 * `sx` styles keyed by tone, in the shape `BaseStatus` expects for its `styles`
 * prop. Lets a `base-status` specific use the same soft chip tones as
 * `StatusChip` (Dashboard v2 / issue page v2 design).
 */
export const softToneStyles = (): Record<StatusChipTone, Record<string, any>> =>
  (Object.keys(TONE_COLORS) as StatusChipTone[]).reduce(
    (acc, tone) => {
      const { bg, fg } = TONE_COLORS[tone]
      acc[tone] = {
        height: 22,
        borderRadius: '11px',
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: bg,
        color: fg,
        '& .MuiChip-label': { padding: '0 9px' },
        '& .MuiChip-icon': { color: fg, fontSize: 14, marginLeft: '7px', marginRight: '-4px' }
      }
      return acc
    },
    {} as Record<StatusChipTone, Record<string, any>>
  )
