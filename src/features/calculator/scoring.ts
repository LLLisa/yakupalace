/**
 * Riichi scoring: given han and fu, compute the four standard payouts
 * (dealer ron/tsumo and non-dealer ron/tsumo) at once.
 *
 * Points derive from a "base" value = fu × 2^(2 + han), capped at named
 * limits (mangan and above). Each payout is the base times a multiplier,
 * rounded up to the nearest 100.
 */

export type LimitName = 'mangan' | 'haneman' | 'baiman' | 'sanbaiman' | 'yakuman'

export const HAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const
export const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110] as const

export const LIMIT_LABELS: Record<LimitName, string> = {
  mangan: 'Mangan',
  haneman: 'Haneman',
  baiman: 'Baiman',
  sanbaiman: 'Sanbaiman',
  yakuman: 'Yakuman',
}

export interface HandScore {
  /** Single payment from the discarder. */
  nonDealerRon: number
  nonDealerTsumo: {
    /** Paid by each of the two other non-dealers. */
    fromEachNonDealer: number
    /** Paid by the dealer. */
    fromDealer: number
    total: number
  }
  /** Single payment from the discarder. */
  dealerRon: number
  dealerTsumo: {
    /** Paid by each of the three non-dealers. */
    fromEach: number
    total: number
  }
  /** Named limit reached, or null for a fu-computed score. */
  limit: LimitName | null
}

/** Round up to the nearest 100, per riichi rules. */
function roundUp100(value: number): number {
  return Math.ceil(value / 100) * 100
}

function basePoints(han: number, fu: number): { base: number; limit: LimitName | null } {
  if (han >= 13) return { base: 8000, limit: 'yakuman' }
  if (han >= 11) return { base: 6000, limit: 'sanbaiman' }
  if (han >= 8) return { base: 4000, limit: 'baiman' }
  if (han >= 6) return { base: 3000, limit: 'haneman' }
  if (han >= 5) return { base: 2000, limit: 'mangan' }

  const raw = fu * Math.pow(2, 2 + han)
  // A fu-computed base that reaches 2000 is capped at mangan.
  if (raw >= 2000) return { base: 2000, limit: 'mangan' }
  return { base: raw, limit: null }
}

export function scoreHand(han: number, fu: number): HandScore {
  const { base, limit } = basePoints(han, fu)

  const fromEachNonDealer = roundUp100(base * 1)
  const fromDealerOnTsumo = roundUp100(base * 2)
  const dealerTsumoEach = roundUp100(base * 2)

  return {
    nonDealerRon: roundUp100(base * 4),
    nonDealerTsumo: {
      fromEachNonDealer,
      fromDealer: fromDealerOnTsumo,
      total: fromEachNonDealer * 2 + fromDealerOnTsumo,
    },
    dealerRon: roundUp100(base * 6),
    dealerTsumo: {
      fromEach: dealerTsumoEach,
      total: dealerTsumoEach * 3,
    },
    limit,
  }
}
