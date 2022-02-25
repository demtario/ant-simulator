import { GAME_BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from '../consts'
import { Ant } from './Ant'
import { AntColony } from './AntColony'
import { FoodSource } from './FoodSource'
import { Pheromon } from './Pheromon'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

export class Game {
  private lastRender = 0

  public colony: AntColony
  public ants: Ant[]
  public foodPheromons: Pheromon[] = []
  public homePheromons: Pheromon[] = []
  public foodSources: FoodSource[] = []

  constructor() {
    this.colony = new AntColony(GAME_WIDTH / 2, GAME_HEIGHT / 2)
    this.ants = Array.from({ length: 30 }, () => new Ant(this.colony.x, this.colony.y))

    this.foodSources = Array.from(
      { length: 4 },
      () => new FoodSource(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
    )

    this.loop(0)
  }

  draw() {
    ctx.fillStyle = GAME_BACKGROUND_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.foodPheromons.forEach((e) => e.draw(ctx))
    this.homePheromons.forEach((e) => e.draw(ctx))

    this.ants.forEach((e) => e.draw(ctx))

    this.foodSources.forEach((e) => e.draw(ctx))

    this.colony.draw(ctx)
  }

  update(deltaTime: number) {
    this.foodPheromons.forEach((e) => e.update(this, deltaTime))
    this.homePheromons.forEach((e) => e.update(this, deltaTime))
    this.foodPheromons = this.foodPheromons.filter((e) => e.strength > 0)
    this.homePheromons = this.homePheromons.filter((e) => e.strength > 0)

    this.ants.forEach((e) => e.update(this, deltaTime))

    this.foodSources.forEach((e) => e.update(this, deltaTime))
    this.foodSources = this.foodSources.filter((e) => e.foodLeft > 0)

    this.colony.update(this, deltaTime)
  }

  loop(timestap: number) {
    const deltaTime = timestap - this.lastRender
    this.lastRender = timestap

    this.update(deltaTime)
    this.draw()

    window.requestAnimationFrame((t: number) => this.loop(t))
  }

  onMouseClick(x: number, y: number) {
    this.foodSources.push(new FoodSource(x, y))
  }
}
