
export interface ImageItem {
  id: string;
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}

export interface Connection {
  targetIndex: number;
  x: number; // 0-100 percentage on main image
  y: number; // 0-100 percentage on main image
  relationship: string;
  interpretation: string;
  focusX: number; // 0-100 percentage on the TARGET image (subject center)
  focusY: number; // 0-100 percentage on the TARGET image (subject center)
}

export interface GalleryAnalysis {
  mainPhotoIndex: number;
  summary: string;
  connections: Connection[];
}

export interface AnalysisResult {
  summary: string;
  detailedDescription: string;
  estimatedConfidence: number;
  sceneType: 'indoor' | 'outdoor' | 'studio' | 'abstract' | 'unknown';
  mood: string;
  objects: Array<{ name: string; count: number; description: string }>;
  colors: string[];
  tags: string[];
}
