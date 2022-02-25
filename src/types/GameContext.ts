import { Ant } from '../models/Ant'
import { AntColony } from '../models/AntColony'
import { FoodSource } from '../models/FoodSource'
import { Pheromon } from '../models/Pheromon'

export interface GameContext {
  colony: AntColony
  ants: Ant[]

  foodSources: FoodSource[]

  foodPheromons: Pheromon[]
  homePheromons: Pheromon[]
}
