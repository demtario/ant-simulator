export const calcDistance = (source: { x: number; y: number }, target: { x: number; y: number }) =>
  Math.hypot(target.x - source.x, target.y - source.y)
