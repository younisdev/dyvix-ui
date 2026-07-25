declare module '*.css';
declare module '*.json';
declare module '*?raw' {
  const content: string;
  export default content;
}
