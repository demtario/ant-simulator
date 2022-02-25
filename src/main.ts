import { GAME_HEIGHT, GAME_WIDTH } from './consts'
import { Game } from './models/Game'
import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
  canvas.addEventListener('click', (e) => {
    game.onMouseClick(e.offsetX, e.offsetY)
  })

  // @ts-ignore
  window.game = game
})
