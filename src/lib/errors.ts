export type SkippableError = {
  error: Error,
  skipped: () => Promise<boolean>
}

export enum ErrorCode {
  INVALID_TAG_NAME = "INVALID_TAG_NAME",
  INVALID_RAW_LINE = "INVALID_RAW_LINE",
  INVALID_LINE_FORMAT = "INVALID_LINE_FORMAT",
  LINE_TIMESTAMP_DUPLICATE = "LINE_TIMESTAMP_DUPLICATE",
  LINE_NOT_FOUND = "LINE_NOT_FOUND",
  INVALID_TIMESTAMP_FORMAT = "INVALID_TIMESTAMP_FORMAT"
}