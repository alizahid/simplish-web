declare module '*.svg'

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_API_URI: string
  }
}