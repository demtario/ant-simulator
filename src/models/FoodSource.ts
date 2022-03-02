import { GameContext } from '../types/GameContext'
import { round } from '../utils'
import { Entity } from './Entity'

export class FoodSource implements Entity {
  public x: number
  public y: number

  public foodLeft: number

  readonly color = '#65d269'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.foodLeft = round(Math.random() * 400 + 200, 0)
  }

  update(_ctx: GameContext, _deltaTime: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(round(this.x), round(this.y), this.size, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${this.foodLeft}`, round(this.x - 10), round(this.y))
  }

  removeFood() {
    this.foodLeft--
  }

  get size() {
    return Math.max(20, round(this.foodLeft / 20))
  }
}
