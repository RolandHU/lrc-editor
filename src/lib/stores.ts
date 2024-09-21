import { get, readable, writable } from "svelte/store"
import lrcManager from "./lrcManager"
import { createTimestamp } from "./utils"
import type { Line, Timestamp } from "./types"

export const lrc = readable(lrcManager())

export const currentTime = writable(0)
export const currentTimestamp = writable<Timestamp>()
export const currentLine = writable<Line>()

currentTime.subscribe(time => {
  const timestamp = createTimestamp(time)

  currentTimestamp.set(timestamp)
  currentLine.set(get(lrc).getLineByTimestamp(timestamp))
})