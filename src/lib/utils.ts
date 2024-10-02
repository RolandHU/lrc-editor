import type { Timestamp } from "./types"
import { ErrorCode } from "./errors"

export function createTimestamp(time: string | number): Timestamp {
  return {
    raw: typeof(time) === "number" ? Math.floor(time * 1000) : parseTime(time),
    formatted: typeof(time) === "string" ? time : convertTime(time * 1000)
  }
}

function parseTime(timestamp: string): number {
  const [ minutes, seconds, centiseconds ] = timestamp.split(/:|\./)
  if (!(minutes && seconds && centiseconds)) throw Error(ErrorCode.INVALID_TIMESTAMP_FORMAT)

  return Number(minutes) * 60000 + Number(seconds) * 1000 + Number(centiseconds) * 10
} 

function convertTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)
  const centiseconds = Math.floor((milliseconds % 1000) / 10)

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`
}