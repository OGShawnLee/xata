export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHAT_TOKEN: string;
    }
  }
}
