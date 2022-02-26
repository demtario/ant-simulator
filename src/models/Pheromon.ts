import { GAME_SHOW_PHEROMONS } from '../consts'
import { GameContext } from '../types/GameContext'
import { Entity } from './Entity'

export enum PheromonType {
  Food,
  Home,
}

const FOOD_COLOR = '#5588a3'
const HOME_COLOR = '#d56073'

export class Pheromon implements Entity {
  public x: number
  public y: number

  public lifeTime = 0
  public color: string
  public type: PheromonType

  public static maxLifeTime = 20 * 1000

  readonly size = 2

  constructor(x: number, y: number, type: PheromonType) {
    this.x = x
    this.y = y
    this.type = type
    this.color = this.type === PheromonType.Food ? FOOD_COLOR : HOME_COLOR
  }

  update(_ctx: GameContext, deltaTime: number) {
    this.lifeTime += deltaTime
  }

  get strength() {
    return Math.floor((this.lifeTime / Pheromon.maxLifeTime) * 100)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!GAME_SHOW_PHEROMONS) return

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
