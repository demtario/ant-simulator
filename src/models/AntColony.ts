import { GameContext } from '../types/GameContext'
import { round } from '../utils'
import { Entity } from './Entity'

export class AntColony implements Entity {
  public x: number
  public y: number

  public size = 30
  public score = 0

  readonly color = '#a1583e'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(_ctx: GameContext, _deltaTime: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(round(this.x), round(this.y), this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${this.score}`, this.x, this.y)
  }

  increaseScore(value = 1) {
    this.score += value
  }
}
