import { writable, get } from "svelte/store"
import { createTimestamp } from "./utils"
import type { Line, Timestamp, ActiveLine } from "./types"
import { LineType, tagTypeIndex } from "./types"

export const lines = writable<Line[]>([])
export const currentTime = writable(0)
export const currentTimestamp = writable<Timestamp>()
export const activeLine = writable<ActiveLine | undefined>()

// Adds a new line if the tag name is valid and sets the value as the content of the line
// Sets the timestamp of the line based on the position of the tag name to ensure correct line order
export const setTag = (name: string, value: string): void => {
  if (tagTypeIndex(name) < 0) throw Error(`Tag doesn't exist with name ${name}`)
  
  const timestamp = createTimestamp(-1000 - tagTypeIndex(name))
  const index = getLineIndexByTimestamp(timestamp, get(lines), true)

  const tag = {
    id: crypto.randomUUID(),
    rawContent: `[${name}:${value}]`,
    content: value,
    timestamp,
    type: LineType.TAG
  }
  
  lines.update(prevLines => {
    if (index >= 0) return [...prevLines.slice(0, index), tag, ...prevLines.slice(index + 1)]
    else return [...prevLines, tag].sort((a, b) => a.timestamp.raw - b.timestamp.raw)
  })
}

// Returns a tag line based on the calculated order timestamp if the tag name is valid and the tag exists
export const getTag = (name: string): Line | undefined => {
  if (tagTypeIndex(name) < 0) throw Error(`Tag doesn't exist with name ${name}`)

  const currLines = get(lines)
  const timestamp = createTimestamp(-1000 - tagTypeIndex(name))
  const index = getLineIndexByTimestamp(timestamp, currLines, true)

  return currLines[index]
}

// Adds a new line if the content and timestamp is valid
export const addLine = (content: string | string[], timestamp: Timestamp | Timestamp[]): void => {
  // Content and timestamp is array --> Extended lyric line
  // Only timestamp is array        --> Repeating lyric line
  // None of them is an array       --> Normal lyric line
  const newLines: Line[] = []

  if (!Array.isArray(content)) {
    const timestamps = Array.isArray(timestamp) ? timestamp : [ timestamp ]

    timestamps.forEach(timestamp => {
      if (getLineByTimestamp(timestamp, true)) throw Error("Line already exists with this timestamp")

      newLines.push({
        id: crypto.randomUUID(),
        rawContent: `${timestamps.map(time => `[${time.formatted}]`).join("")}${content}`,
        content,
        timestamp,
        type: LineType.LYRIC
      })
    })
  } else if (Array.isArray(content) && Array.isArray(timestamp)) {
    if (content.length !== timestamp.length) throw Error("Invalid line structure")
    if (getLineByTimestamp(timestamp[0], true)) throw Error("Line already exists with this timestamp")

    const words: Line[] = content.map((cnt, index) => {
      if (getLineByTimestamp(timestamp[index], true)) throw Error("Line already exists with this timestamp")

      return {
        id: crypto.randomUUID(),
        rawContent: `${index > 0 ? `<${timestamp[index].formatted}>` : ""}${cnt}`,
        content: cnt,
        timestamp: timestamp[index],
        type: LineType.LYRIC
      }
    })

    newLines.push({
      id: crypto.randomUUID(),
      rawContent: `[${timestamp[0].formatted}]${words.map(wrd => wrd.rawContent).join("")}`,
      content: words.map(wrd => wrd.content).join(" "),
      words,
      timestamp: (timestamp[0]),
      type: LineType.LYRIC
    })
  } else throw Error("Invalid line structure")

  lines.update(prevLines => [...prevLines, ...newLines].sort((a, b) => a.timestamp.raw - b.timestamp.raw))
  activeLine.set(getLineByTimestamp(get(currentTimestamp)))
}

// Removes a line if the id is valid, or removes all of the lines if the id is not provided
export const removeLine = (id?: string): void => {
  if (!id) return lines.set([])

  const index = get(lines).findIndex(line => line.id === id)
  if (index < 0) throw Error("Line doesn't exist with this id")
  
  lines.update(prevLines => {
    prevLines.splice(index, 1)
    return prevLines
  })
  activeLine.set(getLineByTimestamp(get(currentTimestamp)))
}

// Gets a line by its id
export const getLineById = (id: string): Line | undefined => get(lines).find(line => line.id === id)

// Gets a line's index based on the timestamp, then returns the line
export const getLineByTimestamp = (timestamp: Timestamp, precise: boolean = false): ActiveLine | undefined => {
  const currLines = get(lines)
  const line = currLines[getLineIndexByTimestamp(timestamp, currLines, precise)]

  if (!line) return undefined
  if (!line?.words) return { line, highlight: undefined }

  return { line, highlight: line.words[getLineIndexByTimestamp(timestamp, line.words)].timestamp }
}

// Gets the index of the provided line array, which has the closest smaller timestamp to the provided timestamp, or has the exact timestamp as the provided timestamp
const getLineIndexByTimestamp = (timestamp: Timestamp, currLines?: Line[], precise: boolean = false) => {
  currLines = currLines || get(lines)
  if (currLines.length === 0) return -1

  let left = 0
  let right = currLines.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (currLines[mid].timestamp.raw === timestamp.raw) return mid
    else if (currLines[mid].timestamp.raw < timestamp.raw) left = mid + 1
    else right = mid - 1
  }

  return precise ? -1 : left - 1
}

// Parses the provided file, creates new lines and adds them to the array
export const parse = (file: File): void => {
  const reader = new FileReader()
  reader.readAsText(file)

  reader.onloadend = ({ target }) => {
    const result = target?.result
    if (!result) throw Error(`${file.name} is empty`)
    if (result instanceof ArrayBuffer) return
    
    result.split("\n").forEach(line => {
      line = line.trim()
      if (line.length === 0) return

      // Handling tags
      let parsedLine = line.match(/^\[(?<name>\w+):(?<value>.+)\]$/)?.groups
      if (parsedLine?.name && parsedLine?.value) return setTag(parsedLine.name, parsedLine.value) 

      // Handling repeating lines
      parsedLine = line.match(/^(?<timestamps>(\[\d{2}:\d{2}.\d{2}\]){2,})(?<value>.+)$/)?.groups
      if (parsedLine?.timestamps && parsedLine?.value) {
        const timestamps = [...parsedLine.timestamps.matchAll(/\[(\d{2}:\d{2}.\d{2})\]/g)].map(timestamp => createTimestamp(timestamp[1]))
        return addLine(parsedLine.value, timestamps)
      }

      // Handling simple and extended lines
      parsedLine = line.match(/^\[(?<timestamp>\d{2}:\d{2}.\d{2})\](?<value>.+)$/)?.groups
      if (parsedLine?.timestamp && parsedLine?.value) {
        const timestamps = [ createTimestamp(parsedLine.timestamp), ...[...line.matchAll(/<(\d{2}:\d{2}.\d{2})>/g)].map(timestamp => createTimestamp(timestamp[1]))]
        const words = parsedLine.value.split(/<\d{2}:\d{2}.\d{2}>/g)
        return addLine(words.length > 1 ? words : words[0], timestamps)
      }

      throw Error(`Invalid line: ${line}`)
    })
  }

  reader.onerror = () => { throw Error("Failed to read file") }
}

// Concatenates all raw line contents into a single string.
export const convert = (): string => {
  const linesToConvert: string[] = []

  get(lines).forEach(line => {
    if (linesToConvert.includes(line.rawContent)) return
    linesToConvert.push(line.rawContent)
  })

  return linesToConvert.join("\n")
}

currentTime.subscribe(time => {
  try {
    const timestamp = createTimestamp(time)
    currentTimestamp.set(timestamp)
    activeLine.set(getLineByTimestamp(timestamp))
  } catch (error) {
    throw Error(`Failed to retrieve the current line: ${error}`)
  }
})