import { GAME_HEIGHT } from '../consts'
import { Pheromon } from './Pheromon'

const cellKey = (x: number, y: number) => x * (GAME_HEIGHT + 1) + y

/**
 * Spatial index of pheromons. Cells are stored in a flat Map keyed by an integer,
 * and all pheromons are additionally kept in a list, so iterating, counting and
 * pruning dead ones do not allocate or rebuild the structure.
 */
export class PheromonMap {
  private cells = new Map<number, Pheromon[]>()
  private list: Pheromon[] = []

  push(pheromon: Pheromon) {
    const key = cellKey(pheromon.x, pheromon.y)
    const cell = this.cells.get(key)

    if (cell) cell.push(pheromon)
    else this.cells.set(key, [pheromon])

    this.list.push(pheromon)
  }

  get(x: number, y: number): readonly Pheromon[] {
    return this.cells.get(cellKey(x, y)) ?? []
  }

  /**
   * Sum of `strength` of all pheromons within the radius. Does not allocate.
   */
  getStrengthInCircle(x: number, y: number, radius: number) {
    const radiusSq = radius * radius
    let sum = 0

    for (let searchedX = Math.floor(x - radius); searchedX < x + radius; searchedX++) {
      for (let searchedY = Math.floor(y - radius); searchedY < y + radius; searchedY++) {
        const cell = this.cells.get(cellKey(searchedX, searchedY))
        if (!cell) continue

        for (let i = 0; i < cell.length; i++) {
          const dx = cell[i].x - x
          const dy = cell[i].y - y
          if (dx * dx + dy * dy <= radiusSq) sum += cell[i].strength
        }
      }
    }

    return sum
  }

  forEach(callback: (pheromon: Pheromon) => void) {
    for (let i = 0; i < this.list.length; i++) callback(this.list[i])
  }

  /**
   * Removes (in place) all pheromons matching the predicate and returns them.
   */
  removeWhere(predicate: (pheromon: Pheromon) => boolean) {
    const removed: Pheromon[] = []
    let kept = 0

    for (let i = 0; i < this.list.length; i++) {
      const pheromon = this.list[i]

      if (predicate(pheromon)) {
        this.removeFromCell(pheromon)
        removed.push(pheromon)
      } else {
        this.list[kept++] = pheromon
      }
    }

    this.list.length = kept

    return removed
  }

  private removeFromCell(pheromon: Pheromon) {
    const key = cellKey(pheromon.x, pheromon.y)
    const cell = this.cells.get(key)
    if (!cell) return

    const index = cell.indexOf(pheromon)
    if (index !== -1) cell.splice(index, 1)
    if (cell.length === 0) this.cells.delete(key)
  }

  get length() {
    return this.list.length
  }
}
