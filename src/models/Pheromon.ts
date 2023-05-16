import { GAME_BACKGROUND_COLOR, GAME_PHEROMONS_LIFESPAN } from '../consts'
import { GameContext } from '../types/GameContext'
import { round } from '../utils'
import { Entity } from './Entity'

export enum PheromonType {
  Food,
  Home,
}

const FOOD_COLOR = '#5588a3'
const HOME_COLOR = '#d56073'

let lastId = 0

export class Pheromon implements Entity {
  public id: number
  public x: number
  public y: number

  public lifeTime = 0
  public type: PheromonType
  public lastRenderedStep = 0

  public static maxLifeTime = GAME_PHEROMONS_LIFESPAN * 1000

  readonly size = 2

  constructor(x: number, y: number, type: PheromonType) {
    this.id = ++lastId
    this.x = round(x)
    this.y = round(y)
    this.type = type
  }

  update(_ctx: GameContext, deltaTime: number) {
    this.lifeTime += deltaTime
  }

  get isDead() {
    return this.lifeTime >= Pheromon.maxLifeTime
  }

  get color() {
    return this.type === PheromonType.Food ? FOOD_COLOR : HOME_COLOR
  }

  /**
   * From 100 to 1
   */
  get strength() {
    return 100 - Math.floor((this.lifeTime / Pheromon.maxLifeTime) * 100)
  }

  /**
   * From 1 to 10
   */
  get renderStep() {
    return 10 - round(this.strength / 10) + 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.lastRenderedStep === this.renderStep) return

    const opacity = Math.floor(
      (Math.max(Pheromon.maxLifeTime - this.lifeTime, 0) / Pheromon.maxLifeTime) * 255
    )
      .toString(16)
      .padStart(2, '0')

    ctx.fillStyle = GAME_BACKGROUND_COLOR
    ctx.fillRect(round(this.x - this.size / 2), round(this.y - this.size / 2), this.size, this.size)
    ctx.fillStyle = this.color + opacity
    ctx.fillRect(round(this.x - this.size / 2), round(this.y - this.size / 2), this.size, this.size)

    this.lastRenderedStep = this.renderStep
  }
}
