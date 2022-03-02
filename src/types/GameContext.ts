import { Ant } from '../models/Ant'
import { AntColony } from '../models/AntColony'
import { FoodSource } from '../models/FoodSource'
import { PheromonMap } from '../models/PheromonMap'

export interface GameContext {
  colony: AntColony
  ants: Ant[]

  foodSources: FoodSource[]

  foodPheromons: PheromonMap
  homePheromons: PheromonMap
}
