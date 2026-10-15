import {
  GAME_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH,
  GAME_ANTS,
  GAME_SHOW_PHEROMONS,
  GAME_SHOW_PERFORMANCE,
  GAME_STEP_TIME,
} from '../consts'
import { round } from '../utils'
import { Ant } from './Ant'
import { AntColony } from './AntColony'
import { FoodSource } from './FoodSource'
import { Pheromon } from './Pheromon'
import { PheromonMap } from './PheromonMap'

const primarySceneCanvas = document.querySelector<HTMLCanvasElement>('#primaryScene')!
const pheromonsSceneCanvas = document.querySelector<HTMLCanvasElement>('#pheromonsScene')!

const ctx = primarySceneCanvas.getContext('2d', { alpha: false })!
const pheromonsCtx = pheromonsSceneCanvas.getContext('2d')!

export class Game {
  private isActive = true
  private lastRender = 0
  private accumulatedTime = 0

  public colony: AntColony
  public ants: Ant[]
  public foodPheromons = new PheromonMap()
  public homePheromons = new PheromonMap()
  public foodSources: FoodSource[] = []

  /** Pheromons removed since the last draw, still to be erased from the pheromons canvas */
  private deadPheromons: Pheromon[] = []

  public times: number[] = []
  public fps = 0
  public updateTime = 0
  public drawTime = 0

  constructor() {
    this.colony = new AntColony(Math.random() * (GAME_WIDTH / 2), Math.random() * (GAME_HEIGHT / 2))
    this.ants = Array.from({ length: GAME_ANTS }, () => new Ant(this.colony.x, this.colony.y))

    this.foodSources = Array.from(
      { length: 4 },
      () => new FoodSource(Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT)
    )

    this.loop(0)
  }

  draw() {
    ctx.fillStyle = GAME_BACKGROUND_COLOR
    ctx.fillRect(0, 0, primarySceneCanvas.width, primarySceneCanvas.height)

    if (GAME_SHOW_PHEROMONS) {
      this.erasePheromons()

      this.foodPheromons.forEach((e) => e.draw(pheromonsCtx))
      this.homePheromons.forEach((e) => e.draw(pheromonsCtx))

      ctx.drawImage(pheromonsSceneCanvas, 0, 0)
    }

    this.ants.map((e) => e.draw(ctx))

    this.foodSources.map((e) => e.draw(ctx))

    this.colony.draw(ctx)

    if (GAME_SHOW_PERFORMANCE) this.drawPerfomance()
  }

  erasePheromons() {
    this.deadPheromons.forEach((dead) => {
      dead.erase(pheromonsCtx)

      // Clearing may have cut into overlapping neighbours, force them to be redrawn
      for (let x = dead.x - 1; x <= dead.x + 1; x++) {
        for (let y = dead.y - 1; y <= dead.y + 1; y++) {
          this.foodPheromons.get(x, y).forEach((p) => (p.lastRenderedStep = 0))
          this.homePheromons.get(x, y).forEach((p) => (p.lastRenderedStep = 0))
        }
      }
    })
    this.deadPheromons = []
  }

  drawPerfomance() {
    ctx.fillStyle = '#000'
    const usedMemeory = window.performance.memory.usedJSHeapSize

    ctx.fillText(`FPS: ${this.fps}`, 10, 20)
    ctx.fillText(`Memory: ${round(usedMemeory / 1024 / 1024)} MB`, 10, 30)
    ctx.fillText(`Update time: ${round(this.updateTime, 2)}ms`, 10, 40)
    ctx.fillText(`Render time: ${round(this.drawTime, 2)}ms`, 10, 50)
    ctx.fillText(`Elements count: ${this.foodPheromons.length + this.homePheromons.length}`, 10, 60)
  }

  update(deltaTime: number) {
    this.foodPheromons.forEach((p) => p.update(this, deltaTime))
    this.homePheromons.forEach((p) => p.update(this, deltaTime))
    const dead = [
      ...this.foodPheromons.removeWhere((p) => p.isDead),
      ...this.homePheromons.removeWhere((p) => p.isDead),
    ]
    if (GAME_SHOW_PHEROMONS) this.deadPheromons.push(...dead)

    this.ants.map((e) => e.update(this, deltaTime))

    this.foodSources.map((e) => e.update(this, deltaTime))
    this.foodSources = this.foodSources.filter((e) => e.foodLeft > 0)

    this.colony.update(this, deltaTime)
  }

  loop(timestap: number) {
    if (!this.isActive) return

    const deltaTime = timestap - this.lastRender
    this.lastRender = timestap

    const now = performance.now()
    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift()
    }
    this.times.push(now)
    this.fps = this.times.length

    // Fixed step keeps the simulation independent of the display refresh rate
    this.accumulatedTime += Math.min(deltaTime, 100)
    while (this.accumulatedTime >= GAME_STEP_TIME) {
      this.update(GAME_STEP_TIME)
      this.accumulatedTime -= GAME_STEP_TIME
    }
    const updateEnd = performance.now()
    this.draw()
    const drawEnd = performance.now()

    this.updateTime = updateEnd - now
    this.drawTime = drawEnd - updateEnd

    window.requestAnimationFrame((t: number) => this.loop(t))
  }

  stop() {
    this.isActive = false
  }

  onMouseClick(x: number, y: number) {
    this.foodSources.push(new FoodSource(x, y))
  }
}
