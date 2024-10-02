import {
  HTMLInputAttributes,
  HTMLTextareaAttributes,
} from 'svelte/elements'

/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'svelte/elements' {
  export interface HTMLInputAttributes {
    'on:accept'?: (event: any) => any
  }
  export interface HTMLTextareaAttributes {
    'on:accept'?: (event: any) => any
  }
}

export {}