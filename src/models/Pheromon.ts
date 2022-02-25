import { GameContext } from '../types/GameContext'
import { Entity } from './Entity'

export enum PheromonType {
  Food,
  Home,
}

export class Pheromon implements Entity {
  public x: number
  public y: number

  public lifeTime = 0
  public color: string
  public type: PheromonType

  public static maxLifeTime = 10 * 1000

  readonly size = 2
  readonly foodColor = '#d56073'
  readonly homeColor = '#5588a3'

  constructor(x: number, y: number, type: PheromonType) {
    this.x = x
    this.y = y
    this.type = type
    this.color = this.type === PheromonType.Food ? this.foodColor : this.homeColor
  }

  update(_ctx: GameContext, deltaTime: number) {
    this.lifeTime += deltaTime
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = Math.floor(
      (Math.max(Pheromon.maxLifeTime - this.lifeTime, 0) / Pheromon.maxLifeTime) * 256
    )
      .toString(16)
      .padStart(2, '0')

    ctx.fillStyle = this.color + opacity
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}
