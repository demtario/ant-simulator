import { GameContext } from '../types/GameContext'
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
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }

  increaseScore(value = 1) {
    this.score += value
  }
}
