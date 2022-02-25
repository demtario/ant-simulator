import { GameContext } from '../types/GameContext'
import { Entity } from './Entity'

export enum PheromonType {
  Food,
  Home,
}

export class Pheromon implements Entity {
  public x: number
  public y: number

  public strength = 100
  public type: PheromonType

  public static maxStrength = 100
  public static maxLifeTime = 10 * 1000

  readonly size = 2
  readonly foodColor = '#d56073'
  readonly homeColor = '#5588a3'

  constructor(x: number, y: number, type: PheromonType) {
    this.x = x
    this.y = y
    this.type = type
  }

  update(_ctx: GameContext, deltaTime: number) {
    this.strength -= (deltaTime / Pheromon.maxLifeTime) * Pheromon.maxStrength
  }

  draw(ctx: CanvasRenderingContext2D) {
    const baseColor = this.type === PheromonType.Food ? this.foodColor : this.homeColor
    const opacity = Math.floor((this.strength / Pheromon.maxStrength) * 256)
      .toString(16)
      .padStart(2, '0')

    ctx.fillStyle = baseColor + opacity
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}
