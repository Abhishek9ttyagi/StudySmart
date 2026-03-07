import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });

export async function generateGuide(input: { text?: string; file?: { data: string; mimeType: string } }) {
  const parts = [];
  if (input.file) {
    parts.push({
      inlineData: {
        data: input.file.data,
        mimeType: input.file.mimeType,
      },
    });
  }
  if (input.text) {
    parts.push({ text: input.text });
  }

  const prompt = `Analyze the provided document, image, or topic. 
  1. Extract the main topics and create a detailed, well-formatted study guide using Markdown. Include sections for Introduction, Key Concepts, Detailed Explanations, and Summary.
  2. At the very end of your response, provide a comma-separated list of the main topics extracted, prefixed with "EXTRACTED_TOPICS:". For example: EXTRACTED_TOPICS: Quantum Mechanics, String Theory, Relativity.`;
  
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
  });

  const fullText = response.text || "";
  const topicsMatch = fullText.match(/EXTRACTED_TOPICS:\s*(.*)/);
  let topics: string[] = [];
  let guideContent = fullText;

  if (topicsMatch && topicsMatch[1]) {
    topics = topicsMatch[1].split(",").map(t => t.trim());
    guideContent = fullText.replace(/EXTRACTED_TOPICS:\s*(.*)/, "").trim();
  } else {
    topics = ["General Overview"];
  }

  return { guideContent, topics };
}

export async function generateQuiz(
  guideContent: string, 
  selectedTopics: string[],
  difficulty: string = "medium", 
  count: number = 5,
  questionType: "multiple-choice" | "fill-in-the-blank" | "mixed" = "mixed"
) {
  const prompt = `Based on the following study guide, generate ${count} questions focusing on these topics: ${selectedTopics.join(", ")}.
  The difficulty level should be ${difficulty}.
  The question types should be ${questionType}. If mixed, provide a mix of multiple-choice and fill-in-the-blank.
  
Guide Content:
${guideContent}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: "Either 'multiple-choice' or 'fill-in-the-blank'.",
            },
            question: {
              type: Type.STRING,
              description: "The quiz question. For fill-in-the-blank, use '___' for the blank.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four possible answers. Only required for multiple-choice.",
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The exact string of the correct option or the word for the blank.",
            },
            explanation: {
              type: Type.STRING,
              description: "Explanation of why the answer is correct.",
            },
          },
          required: ["type", "question", "correctAnswer", "explanation"],
        },
      },
    },
  });

  const jsonStr = response.text?.trim() || "[]";
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
}

export function createChatSession(guideContent: string) {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a helpful study assistant. You have access to the following study guide:
      
${guideContent}

Answer the user's questions based on this guide. You can also generate more quiz questions if asked, or explain concepts in more detail. If the user asks for quiz questions, format them clearly.`,
    },
  });
}
