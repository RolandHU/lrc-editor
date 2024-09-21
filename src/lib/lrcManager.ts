import { writable, get } from "svelte/store"
import { createTimestamp } from "./utils"
import { type Line, LineType, type Timestamp, tagTypeIndex } from "./types"

const lrcManager = () => {
  const lines = writable<Line[]>([])

  const setTag = (name: string, value: string) => {
    if (tagTypeIndex(name) < 0) throw Error(`Tag doesn't exist with name ${name}`)
    
    const timestamp = createTimestamp(-1000 - tagTypeIndex(name))
    const index = getLineIndexByTimestamp(timestamp, true)

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

  const getTag = (name: string) => {
    if (tagTypeIndex(name) < 0) throw Error(`Tag doesn't exist with name ${name}`)

    const timestamp = createTimestamp(-1000 - tagTypeIndex(name))
    const index = getLineIndexByTimestamp(timestamp, true)

    return get(lines)[index]
  }

  const addLine = (content: string | string[], timestamp: Timestamp | Timestamp[]) => {
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
          type: LineType.SIMPLE_LYRIC
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
          type: LineType.SIMPLE_LYRIC
        }
      })

      newLines.push({
        id: crypto.randomUUID(),
        rawContent: `[${timestamp[0].formatted}]${words.map(wrd => wrd.rawContent).join("")}`,
        content: words.map(wrd => wrd.content).join(" "),
        words,
        timestamp: (timestamp[0]),
        type: LineType.EXTENDED_LYRIC
      })
    } else throw Error("Invalid line structure")

    lines.update(prevLines => [...prevLines, ...newLines].sort((a, b) => a.timestamp.raw - b.timestamp.raw))
  }

  const removeLine = (id?: string) => {
    if (!id) return lines.set([])

    const index = get(lines).findIndex(line => line.id === id)
    if (index < 0) throw Error("Line doesn't exist with this id")
    
    lines.update(prevLines => {
      prevLines.splice(index, 1)
      return prevLines
    })
  }

  const getLineById = (id: string) => get(lines).find(line => line.id === id)

  const getLineByTimestamp = (timestamp: Timestamp, precise: boolean = false) => get(lines)[getLineIndexByTimestamp(timestamp, precise)]

  const getLineIndexByTimestamp = (timestamp: Timestamp, precise: boolean = false) => {
    // Precise:
    //  - false --> Return the index of line with the closest timestamp
    //  - true  --> Return the index of line with the exact timestamp
    const lyricLines: Line[] = get(lines)
    if (lyricLines.length === 0) return -1

    let left = 0
    let right = lyricLines.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)

      if (lyricLines[mid].timestamp.raw === timestamp.raw) return mid
      else if (lyricLines[mid].timestamp.raw < timestamp.raw) left = mid + 1
      else right = mid - 1
    }

    return precise ? -1 : left - 1
  }

  const parse = (file: File) => {
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

  const convert = () => {
    const linesToConvert: string[] = []

    get(lines).forEach(line => {
      if (linesToConvert.includes(line.rawContent)) return
      linesToConvert.push(line.rawContent)
    })

    return linesToConvert.join("\n")
  }

  return { lines, setTag, getTag, addLine, removeLine, getLineById, getLineByTimestamp, parse, convert }
}

export default lrcManager