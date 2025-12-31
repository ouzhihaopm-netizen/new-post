
import { GoogleGenAI, Type } from "@google/genai";
import { GalleryAnalysis, ImageItem } from "./types";

/**
 * Analyzes a gallery of images with a focus on "XiaoHongShu" (Red) social media style narrative.
 */
export const analyzeGallery = async (images: ImageItem[]): Promise<GalleryAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.base64!,
      mimeType: img.file!.type,
    },
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        ...imageParts,
        {
          text: `你是一个顶级小红书摄影博主和文案专家。这有 ${images.length} 张相关的系列照片，请执行以下深度分析：

1. **选出主图**：选出一张最有“封面感”的照片作为主图（返回索引 0-${images.length - 1}）。
2. **视觉关联**：在主图中定位其他照片的视觉来源或逻辑关联点。
3. **坐标定位**：
   - 给每张关联图在主图上的 X, Y 坐标 (0-100)。
   - **重要**：识别每张关联图（即非主图本身）中最重要的主体内容中心点坐标 focusX, focusY (0-100)。
4. **网红文案**：
   - 摘要和解读必须采用【小红书风格】。使用大量 Emoji、语气词（如“家人们谁懂啊”、“绝绝子”、“氛围感拉满”）、亲切的称呼（如“姐妹们”、“宝子们”）。
   - 在总结最后添加 3-5 个热门话题标签（如 #摄影 #日常 #治愈系）。
   - 鼓励读者互动（例如提问：你们更喜欢哪一张？）。
5. **语言**：全部使用中文。`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainPhotoIndex: { type: Type.INTEGER },
          summary: { type: Type.STRING, description: "小红书风格的整体叙事总结，包含Emoji和标签" },
          connections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                targetIndex: { type: Type.INTEGER },
                x: { type: Type.NUMBER, description: "在主图上的水平位置百分比" },
                y: { type: Type.NUMBER, description: "在主图上的垂直位置百分比" },
                focusX: { type: Type.NUMBER, description: "关联图内主体中心的水平坐标 (0-100)" },
                focusY: { type: Type.NUMBER, description: "关联图内主体中心的垂直坐标 (0-100)" },
                relationship: { type: Type.STRING, description: "如：绝美特写、氛围细节等" },
                interpretation: { type: Type.STRING, description: "小红书风格的单图深度解读" }
              },
              required: ["targetIndex", "x", "y", "focusX", "focusY", "relationship", "interpretation"]
            }
          }
        },
        required: ["mainPhotoIndex", "summary", "connections"]
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI 分析失败");
  }

  return JSON.parse(text) as GalleryAnalysis;
};
