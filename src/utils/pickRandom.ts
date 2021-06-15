/**
 * Pick n random items from array.
 */
export function pickRandom<T>(items: Array<T>, n: number): Array<T> {
  if (items.length < n) {
    return items
  }

  const picked = new Set<T>()

  while (picked.size < n) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    picked.add(items[Math.floor(Math.random() * items.length)]!)
  }

  return Array.from(picked)
}
