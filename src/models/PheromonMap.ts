import { calcDistance } from '../utils'
import { Pheromon } from './Pheromon'

export class PheromonMap {
  private map: { [x: string]: { [y: string]: Pheromon[] } } = {}

  constructor(pheromons: Pheromon[] = []) {
    pheromons.forEach((pheromon) => this.push(pheromon))
  }

  push(pheromon: Pheromon) {
    if (!this.map[pheromon.x]) this.map[pheromon.x] = {}

    if (!this.map[pheromon.x][pheromon.y]) this.map[pheromon.x][pheromon.y] = []

    this.map[pheromon.x][pheromon.y].push(pheromon)
  }

  remove(pheromon: Pheromon) {
    if (!this.map[pheromon.x]) return

    if (!this.map[pheromon.x][pheromon.y]) return

    const index = this.map[pheromon.x][pheromon.y].indexOf(pheromon)

    if (index === -1) return

    this.map[pheromon.x][pheromon.y].splice(index, 1)
  }

  get(x: number, y: number) {
    return this.map[x] && this.map[x][y] ? this.map[x][y] : []
  }

  getAllInCircle(x: number, y: number, radius: number) {
    const result: Pheromon[] = []

    for (let searchedX = Math.floor(x - radius); searchedX < x + radius; searchedX++) {
      for (let searchedY = Math.floor(y - radius); searchedY < y + radius; searchedY++) {
        this.get(searchedX, searchedY).forEach((pheromon) => {
          return calcDistance({ x, y }, pheromon) <= radius ? result.push(pheromon) : null
        })
      }
    }

    return result
  }

  forEach(callback: (pheromon: Pheromon) => void) {
    Object.keys(this.map).forEach((x) => {
      Object.keys(this.map[x]).forEach((y) => {
        this.map[x][y].forEach((pheromon) => callback(pheromon))
      })
    })
  }

  filter(callback: (pheromon: Pheromon) => boolean) {
    const filtered: Pheromon[] = []

    this.forEach((pheromon) => {
      if (callback(pheromon)) filtered.push(pheromon)
    })

    return new PheromonMap(filtered)
  }

  get length() {
    let length = 0
    this.forEach(() => length++)
    return length
  }
}
