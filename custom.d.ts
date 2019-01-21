declare module '*.png' {
  const content: any;
  export default content;
}

interface EnvI {
  NODE_ENV: string;
}

interface ProcessI {
  env: EnvI;
}

declare const process: ProcessI;
