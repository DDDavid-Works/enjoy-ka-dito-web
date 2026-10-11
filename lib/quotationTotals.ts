import type { QuotationDetail, QuotationInclusion } from '@/types/package'

// Totals for Package Inclusions in the Quotations module. They are always calculated
// from the prices on the leaf rows and never stored.
//
// - A row with no children is a leaf: its total is its own price.
// - A row with children totals the rows under it; its own price is not used.
// - Rows without a price add nothing. If nothing underneath is priced, the total is undefined.

const round = (n: number) => Math.round(n * 100) / 100

function sumDefined(values: Array<number | undefined>): number | undefined {
  const priced = values.filter((v): v is number => v !== undefined)
  return priced.length ? round(priced.reduce((a, b) => a + b, 0)) : undefined
}

export function detailTotal(detail: QuotationDetail): number | undefined {
  return detail.details.length ? sumDefined(detail.details.map((sub) => sub.price)) : detail.price
}

export function inclusionTotal(inclusion: QuotationInclusion): number | undefined {
  return inclusion.details.length ? sumDefined(inclusion.details.map(detailTotal)) : inclusion.price
}

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// A package lets any row carry its own price even when it has children. A quotation only
// totals leaves, so when a package is loaded the row's own price becomes its first child
// instead of being dropped.
export function moveParentPricesIntoChildren(inclusions: QuotationInclusion[]): QuotationInclusion[] {
  return inclusions.map((inclusion) => {
    const details = inclusion.details.map((detail) => {
      if (detail.details.length && detail.price !== undefined) {
        return {
          text: detail.text,
          details: [{ text: detail.text, price: detail.price }, ...detail.details],
        }
      }
      return detail.details.length ? { text: detail.text, details: detail.details } : detail
    })

    if (details.length && inclusion.price !== undefined) {
      return {
        text: inclusion.text,
        details: [{ text: inclusion.text, price: inclusion.price, details: [] }, ...details],
      }
    }
    return details.length ? { text: inclusion.text, details } : { ...inclusion, details }
  })
}
