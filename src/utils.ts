export const calcDistance = (source: { x: number; y: number }, target: { x: number; y: number }) =>
  Math.hypot(target.x - source.x, target.y - source.y)

export const round = (value: number, precision = 0) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
