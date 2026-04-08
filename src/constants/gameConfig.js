/**
 * Master game configuration.
 * All tunable values live here. Never hardcode these inside components or core logic.
 */

export const LIVES = {
  initial:         3,
  max:             5,
  regenIntervalMs: 30 * 60 * 1000, // 30 minutes
}

export const POINTS = {
  correctAnswer:   10,
  speedBonus:      5,   // awarded if answered within SPEED_THRESHOLD_MS
  speedThresholdMs: 5000,
  wrongAnswer:     0,
  lostLife:        0,
}

export const TIMER = {
  defaultQuestionMs: 30000,
  bossQuestionMs:    60000,
}

export const CANVAS = {
  width:          2500,
  height:         2000,
  viewportWidth:  1000,
  viewportHeight: 700,
}

export const PROGRESS = {
  nodesForIslandComplete: 5,  // nodes needed to unlock next island
  minScoreToPass:         60, // % correct to pass a node
}
