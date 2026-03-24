/// <reference types="vite/client" />

declare module '@mediapipe/tasks-vision' {
  export interface NormalizedLandmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }

  export interface HandLandmarkerResult {
    landmarks?: NormalizedLandmark[][];
    handedness?: Array<{ displayName: string; index: number; score: number }>;
    handednesses?: Array<{ displayName: string; index: number; score: number }>;
  }

  export interface FilesetResolver {
    forVisionTasks(wasmLoaderPath: string): Promise<any>;
  }

  export interface HandLandmarkerOptions {
    baseOptions?: {
      modelAssetPath?: string;
      delegate?: 'GPU' | 'CPU';
    };
    runningMode?: 'IMAGE' | 'VIDEO' | 'LIVE_STREAM';
    numHands?: number;
  }

  export class HandLandmarker {
    static createFromOptions(vision: any, options: HandLandmarkerOptions): Promise<HandLandmarker>;
    detectForVideo(video: HTMLVideoElement, timestamp: number): HandLandmarkerResult;
  }

  export const FilesetResolver: FilesetResolver;
}
