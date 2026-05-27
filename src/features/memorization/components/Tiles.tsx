/**
 * Renders a hand (or partial hand) as a row of mahjong tile images, using the
 * vendored tile-art SVGs in `/public/tiles`. Authored inline in MDX articles:
 *
 *   <Tiles hand="234m 567m 234p 678s 99p" />
 *
 * Notation is standard riichi shorthand. Within a token, digits are followed
 * by a suit letter and each digit becomes one tile:
 *   m = man (characters)   p = pin (circles)   s = sou (bamboo)
 *   z = honors: 1-4 = E/S/W/N winds, 5/6/7 = white/green/red dragon
 *   0 in a suit = the red five (e.g. 0p = red five of pin)
 * Whitespace between tokens renders as a small gap, so you can separate sets:
 *   "111z 222z 333z 444z" shows four spaced wind triplets.
 *
 * @see /public/tiles/CREDITS.md — tile artwork source and GPL-3.0 license.
 */

const HONORS: Record<string, { file: string; label: string }> = {
  '1': { file: 'tan', label: 'East wind' },
  '2': { file: 'nan', label: 'South wind' },
  '3': { file: 'xia', label: 'West wind' },
  '4': { file: 'pei', label: 'North wind' },
  '5': { file: 'haku', label: 'white dragon' },
  '6': { file: 'hatsu', label: 'green dragon' },
  '7': { file: 'chun', label: 'red dragon' },
}

const SUIT_NAMES: Record<string, string> = { m: 'man', p: 'pin', s: 'sou' }

interface Tile {
  file: string
  label: string
}

/** A red five (digit 0) maps to the aka- artwork; the file stem is the suit. */
function suitedTile(digit: string, suit: 'm' | 'p' | 's'): Tile {
  const suitName = SUIT_NAMES[suit]
  if (digit === '0') {
    return { file: `aka${suit === 'm' ? 'man' : suit === 'p' ? 'pin' : 'sou'}`, label: `red five ${suitName}` }
  }
  return { file: `${digit}${suitName}`, label: `${digit} ${suitName}` }
}

/** Parse a shorthand token like "234m" or "1112345678999m" into tiles. */
function parseToken(token: string): Tile[] {
  const tiles: Tile[] = []
  let digits = ''
  for (const ch of token) {
    if (ch >= '0' && ch <= '9') {
      digits += ch
      continue
    }
    if (ch === 'm' || ch === 'p' || ch === 's') {
      for (const d of digits) tiles.push(suitedTile(d, ch))
    } else if (ch === 'z') {
      for (const d of digits) {
        const honor = HONORS[d]
        if (honor) tiles.push(honor)
      }
    }
    digits = ''
  }
  return tiles
}

export interface TilesProps {
  /** Hand in riichi shorthand, e.g. "234m 567m 234p 678s 99p". */
  hand: string
  /** Tile height in pixels (width scales with the 320:446 tile aspect). */
  size?: number
}

export function Tiles({ hand, size = 46 }: TilesProps) {
  // Each whitespace-separated token becomes a visually grouped set.
  const groups = hand.trim().split(/\s+/).map(parseToken)
  const width = Math.round((size * 320) / 446)

  return (
    <span
      className="flex flex-wrap items-end gap-x-3 gap-y-2 my-4"
      role="img"
      aria-label={`Tiles: ${hand}`}
    >
      {groups.map((tiles, g) => (
        <span key={g} className="flex items-end">
          {tiles.map((tile, i) => (
            <img
              key={i}
              src={`/tiles/${tile.file}.svg`}
              alt={tile.label}
              // Inline styles override `.prose-article img` (which forces
              // display:block + auto margins) so tiles sit in a tight row.
              style={{
                display: 'inline-block',
                height: size,
                width,
                margin: 0,
                borderRadius: 3,
              }}
            />
          ))}
        </span>
      ))}
    </span>
  )
}
