import { GameContext } from '../types/GameContext'
import { Entity } from './Entity'

export class FoodSource implements Entity {
  public x: number
  public y: number

  public foodLeft: number

  readonly color = '#65d269'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.foodLeft = Math.random() * 400 + 600
  }

  update(_ctx: GameContext, _deltaTime: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }

  removeFood() {
    this.foodLeft--
  }

  get size() {
    return this.foodLeft / 50
  }
}
