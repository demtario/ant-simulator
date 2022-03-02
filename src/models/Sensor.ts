import { GAME_SHOW_SENSORS } from '../consts'
import { round } from '../utils'
import { PheromonMap } from './PheromonMap'

export class Sensor {
  public x: number
  public y: number

  public sensationRadius = 4

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  updatePosition(x: number, y: number, angle: number, distance: number) {
    this.setPosition(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance)
  }

  getPheromonStrength(pheromons: PheromonMap): number {
    const nearbyPheromons = pheromons.getAllInCircle(this.x, this.y, this.sensationRadius)
    return nearbyPheromons.reduce<number>((sum, pheromon) => sum + pheromon.strength, 0)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!GAME_SHOW_SENSORS) return

    const size = this.sensationRadius
    ctx.strokeStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(round(this.x), round(this.y), size, 0, Math.PI * 2)
    ctx.stroke()
  }
}
