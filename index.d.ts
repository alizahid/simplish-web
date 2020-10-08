declare module '*.svg'

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_API_URI: string

    REACT_APP_FIREBASE_API_KEY: string
    REACT_APP_FIREBASE_PROJECT_ID: string
  }
}
