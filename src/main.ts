import { GAME_HEIGHT, GAME_WIDTH } from './consts'
import { Game } from './models/Game'
import './style.css'

const primarySceneCanvas = document.querySelector<HTMLCanvasElement>('#primaryScene')!
primarySceneCanvas.width = GAME_WIDTH
primarySceneCanvas.height = GAME_HEIGHT

const pheromonsSceneCanvas = document.querySelector<HTMLCanvasElement>('#pheromonsScene')!
pheromonsSceneCanvas.width = GAME_WIDTH
pheromonsSceneCanvas.height = GAME_HEIGHT

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
  primarySceneCanvas.addEventListener('click', (e) => {
    game.onMouseClick(e.offsetX, e.offsetY)
  })

  // @ts-ignore
  window.game = game
})
