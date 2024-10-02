export type Line = {
  id: string,
  rawContent: string,
  content: string,
  words?: Line[],
  timestamp: Timestamp,
  type: LineType
}

export enum LineType {
  TAG,
  LYRIC
}

export enum TagType {
  TI, AR, AL, AU, LENGTH, BY, OFFSET, RE, TOOL, VE, ID
}

export const tagTypeIndex = (tag: string) => {
  return Object.keys(TagType).indexOf(tag.toUpperCase())
}

export type Timestamp = {
  raw: number,
  formatted: string
}

export type ActiveLine = {
  line: Line,
  highlight: Timestamp | undefined
}

export enum ErrorCode {
  INVALID_LINE = "INVALID_LINE"
}