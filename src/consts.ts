export const GAME_WIDTH = 1200
export const GAME_HEIGHT = 800

export const GAME_ANTS = 300
export const GAME_ANTS_WANDERING_STRENGTH = 14 // less - more wandering
export const GAME_PHEROMONS_TIME_DELAY = 60 // miliseconds
export const GAME_PHEROMONS_LIFESPAN = 20 // seconds
// Ants lay weaker pheromons the longer they travel since leaving food/colony, and stop
// after this time. Prevents ants that walk in circles from reinforcing their own trail.
export const GAME_PHEROMONS_LAYING_TIME = 10 // seconds

export const GAME_BACKGROUND_COLOR = '#deb881'

export const GAME_STEP_TIME = 1000 / 60 // miliseconds, fixed simulation step

// FLAGES
export const GAME_SHOW_SENSORS = false
export const GAME_SHOW_PHEROMONS = true
export const GAME_SHOW_PERFORMANCE = true

// DISABLE FEATURES
export const GAME_SENSORS_DISABLED = false
