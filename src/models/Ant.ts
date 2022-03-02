import {
  GAME_HEIGHT,
  GAME_PHEROMONS_TIME_DELAY,
  GAME_SENSORS_DISABLED,
  GAME_WIDTH,
} from '../consts'
import { GameContext } from '../types/GameContext'
import { calcDistance, round } from '../utils'
import { Entity } from './Entity'
import { FoodSource } from './FoodSource'
import { Pheromon, PheromonType } from './Pheromon'
import { Sensor } from './Sensor'

enum AntState {
  SearchingFood,
  ReturningToColony,
}

enum AntDirection {
  Left,
  Forward,
  Right,
}

type ClosestFoodSource = { distance: number; foodSource: FoodSource }

export class Ant implements Entity {
  public x: number
  public y: number

  public angle: number

  public state = AntState.SearchingFood

  // Movement
  public desiredDirection = AntDirection.Forward
  private leftSensor: Sensor
  private forwardSensor: Sensor
  private rightSensor: Sensor

  public timeFromLastPheromon: number = 0

  readonly maxSpeed = 8
  readonly sensorDistance = 8
  readonly wardeningStrength = 20
  readonly pheromonTimeDelay = GAME_PHEROMONS_TIME_DELAY
  readonly size = 6
  readonly color = '#7d5e2a'

  constructor(x = Math.random() * GAME_WIDTH, y = Math.random() * GAME_HEIGHT) {
    this.x = x
    this.y = y
    this.angle = Math.random() * Math.PI * 2

    this.leftSensor = new Sensor(this.x, this.y)
    this.forwardSensor = new Sensor(this.x, this.y)
    this.rightSensor = new Sensor(this.x, this.y)
  }

  async update(ctx: GameContext, deltaTime: number) {
    this.updateSensorPositions()
    this.handleRotate(ctx)

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

  updateSensorPositions() {
    const leftSensorAngle = this.angle - Math.PI / 5
    const rightSensorAngle = this.angle + Math.PI / 5

    // Set sensor position relative to the ant
    this.leftSensor.setPosition(
      this.x + Math.cos(leftSensorAngle) * this.sensorDistance,
      this.y + Math.sin(leftSensorAngle) * this.sensorDistance
    )
    this.rightSensor.setPosition(
      this.x + Math.cos(rightSensorAngle) * this.sensorDistance,
      this.y + Math.sin(rightSensorAngle) * this.sensorDistance
    )
    this.forwardSensor.setPosition(
      this.x + Math.cos(this.angle) * this.sensorDistance,
      this.y + Math.sin(this.angle) * this.sensorDistance
    )
  }

  handleRotate(ctx: GameContext) {
    const pheromons = this.state === AntState.SearchingFood ? ctx.homePheromons : ctx.foodPheromons

    if (!GAME_SENSORS_DISABLED) {
      const leftPheromonsStrength = this.leftSensor.getPheromonStrength(pheromons)
      const forwardPheromonsStrength = this.forwardSensor.getPheromonStrength(pheromons)
      const rightPheromonsStrength = this.rightSensor.getPheromonStrength(pheromons)

      if (forwardPheromonsStrength > Math.max(leftPheromonsStrength, rightPheromonsStrength))
        this.desiredDirection = AntDirection.Forward
      else if (leftPheromonsStrength > rightPheromonsStrength)
        this.desiredDirection = AntDirection.Left
      else if (rightPheromonsStrength > leftPheromonsStrength)
        this.desiredDirection = AntDirection.Right
    }

    // Random rotations
    this.angle = this.desiredAngle + (Math.random() - 0.5) * Math.PI * (1 / this.wardeningStrength)

    // Detect if near food source
    if (this.state === AntState.SearchingFood) {
      const closestFoodSource = this.getClosesFoodSource(ctx.foodSources)
      if (
        closestFoodSource &&
        closestFoodSource.distance <
          this.size + closestFoodSource.foodSource.size + this.sensorDistance
      )
        this.angle = Math.atan2(
          closestFoodSource.foodSource.y - this.y,
          closestFoodSource.foodSource.x - this.x
        )
    }

    // Detect if near home
    if (this.state === AntState.ReturningToColony) {
      const { colony } = ctx
      const distanceToColony = calcDistance(this, colony)
      if (distanceToColony < this.size + colony.size + this.sensorDistance) {
        this.angle = Math.atan2(colony.y - this.y, colony.x - this.x)
      }
    }
  }

  get desiredAngle() {
    if (this.desiredDirection === AntDirection.Left) return this.angle - Math.PI / 5
    else if (this.desiredDirection === AntDirection.Right) return this.angle + Math.PI / 5
    return this.angle
  }

  getClosesFoodSource(foodSources: FoodSource[]): ClosestFoodSource | null {
    return foodSources.reduce<ClosestFoodSource>((closest, foodSource) => {
      const distance = calcDistance(this, foodSource)
      if (!closest || distance < closest.distance) {
        return { distance, foodSource }
      }
      return closest
    }, null as any)
  }

  handleGatherFood({ foodSources }: GameContext) {
    const closestFoodSource = this.getClosesFoodSource(foodSources)

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

    ctx.fillRect(round(this.x - this.size / 2), round(this.y - this.size / 2), this.size, this.size)
    if (this.state === AntState.ReturningToColony) {
      const dropletSize = this.size * 0.5
      ctx.fillStyle = '#52de97'
      ctx.fillRect(this.x - dropletSize / 2, this.y - dropletSize / 2, dropletSize, dropletSize)
    }

    this.leftSensor.draw(ctx)
    this.forwardSensor.draw(ctx)
    this.rightSensor.draw(ctx)
  }
}
