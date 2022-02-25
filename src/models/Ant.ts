import { GAME_HEIGHT, GAME_WIDTH } from '../consts'
import { GameContext } from '../types/GameContext'
import { Entity } from './Entity'
import { FoodSource } from './FoodSource'
import { Pheromon, PheromonType } from './Pheromon'

enum AntState {
  SearchingFood,
  ReturningToColony,
}

export class Ant implements Entity {
  public x: number
  public y: number

  public angle: number

  public state = AntState.SearchingFood

  public timeFromLastPheromon: number = 0

  readonly maxSpeed = 12
  readonly wardeningStrength = 8
  readonly pheromonTimeDelay = 300
  readonly size = 6
  readonly color = '#7d5e2a'

  constructor(x = Math.random() * GAME_WIDTH, y = Math.random() * GAME_HEIGHT) {
    this.x = x
    this.y = y
    this.angle = Math.random() * Math.PI * 2
  }

  update(ctx: GameContext, deltaTime: number) {
    // Random rotations
    this.angle += (Math.random() - 0.5) * Math.PI * (1 / this.wardeningStrength)

    // Handle move
    this.x += Math.cos(this.angle) * deltaTime * (this.maxSpeed / 100)
    this.y += Math.sin(this.angle) * deltaTime * (this.maxSpeed / 100)

    this.handleMapBoundaries()

    if (this.state === AntState.SearchingFood) {
      this.handleGatherFood(ctx)
    } else {
      this.handleReturnToColony(ctx)
    }

    this.createPheromon(ctx, deltaTime)
  }

  handleGatherFood({ foodSources }: GameContext) {
    type ClosestFoodSource = { distance: number; foodSource: FoodSource }
    const closestFoodSource = foodSources.reduce<ClosestFoodSource>((closest, foodSource) => {
      const distance = Math.hypot(foodSource.x - this.x, foodSource.y - this.y)
      if (!closest || distance < closest.distance) {
        return { distance, foodSource }
      }
      return closest
    }, null as any)

    if (!closestFoodSource) return

    if (closestFoodSource.distance < this.size + closestFoodSource.foodSource.size) {
      closestFoodSource.foodSource.removeFood()

      this.state = AntState.ReturningToColony
      this.angle += Math.PI
    }
  }

  handleReturnToColony({ colony }: GameContext) {
    const distanceToColony = Math.hypot(this.x - colony.x, this.y - colony.y)
    if (distanceToColony < this.size + colony.size) {
      this.state = AntState.SearchingFood
      this.angle += Math.PI

      colony.increaseScore()
    }
  }

  handleMapBoundaries() {
    if (this.x < 0) {
      this.x = 0
      this.angle = Math.PI - this.angle
    }
    if (this.y < 0) {
      this.y = 0
      this.angle = -this.angle
    }
    if (this.x > GAME_WIDTH) {
      this.x = GAME_WIDTH
      this.angle = Math.PI - this.angle
    }
    if (this.y > GAME_HEIGHT) {
      this.y = GAME_HEIGHT
      this.angle = -this.angle
    }
  }

  createPheromon(ctx: GameContext, deltaTime: number) {
    this.timeFromLastPheromon += deltaTime

    if (this.timeFromLastPheromon > this.pheromonTimeDelay) {
      this.timeFromLastPheromon = 0

      const pheromonType =
        this.state === AntState.SearchingFood ? PheromonType.Food : PheromonType.Home
      const pheromon = new Pheromon(this.x, this.y, pheromonType)
      if (pheromonType === PheromonType.Food) ctx.foodPheromons.push(pheromon)
      else ctx.homePheromons.push(pheromon)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    if (this.state === AntState.ReturningToColony) {
      const dropletSize = this.size * 0.5
      ctx.fillStyle = '#52de97'
      ctx.fillRect(this.x - dropletSize / 2, this.y - dropletSize / 2, dropletSize, dropletSize)
    }
  }
}
