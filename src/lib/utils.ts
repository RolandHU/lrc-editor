import { type Timestamp } from "./types"

// Timestamp
export const timestamp = (time: string | number): Timestamp => {
  return {
    raw: typeof(time) === "number" ? time : parseTime(time),
    formatted: typeof(time) === "string" ? time : convertTime(time)
  }
}

const parseTime = (timestamp: string): number => {
  const [ minutes, seconds, centiseconds ] = timestamp.split(/:|\./)
  if (!(minutes && seconds && centiseconds)) throw Error("Invalid timestamp format")

  return Number(minutes) * 60000 + Number(seconds) * 1000 + Number(centiseconds) * 10
} 

const convertTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000)
  milliseconds -= minutes * 60000

  const seconds = Math.floor(milliseconds / 1000)
  milliseconds -= seconds * 1000

  const centiseconds = Math.floor(milliseconds / 10)
  milliseconds -= centiseconds * 10

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`
}