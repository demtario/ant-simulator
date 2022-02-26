import { GAME_HEIGHT, GAME_SHOW_SENSORS, GAME_WIDTH } from '../consts'
import { Pheromon } from './Pheromon'

export class Sensor {
  public x: number
  public y: number

  public sensationRadius = 4

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setPosition(x: number, y: number) {
    if (x < 0 || y < 0 || x > GAME_WIDTH || y > GAME_HEIGHT) {
      console.log({ x, y })
    }

    this.x = x
    this.y = y
  }

  getPheromonStrength(pheromons: Pheromon[]): number {
    const pheromonStrengths = pheromons.map((pheromon) => {
      const distance = Math.sqrt(
        Math.pow(this.x - pheromon.x, 2) + Math.pow(this.y - pheromon.y, 2)
      )
      return distance > this.sensationRadius ? 0 : pheromon.strength
    })

    return pheromonStrengths.reduce<number>((a, b) => a + b, 0)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!GAME_SHOW_SENSORS) return

    const size = this.sensationRadius
    ctx.strokeStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
    ctx.stroke()
  }
}
