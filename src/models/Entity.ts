import { GameContext } from '../types/GameContext'

export interface Entity {
  x: number
  y: number

  draw(ctx: CanvasRenderingContext2D): void
  update(ctx: GameContext, deltaTime: number): void
}
