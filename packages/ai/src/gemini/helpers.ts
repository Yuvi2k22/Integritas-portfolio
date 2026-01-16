import { getGeminiClient } from './client';

/**
 * Converts a remote image URL to Gemini-compatible buffer part.
 * Replace this mock with your actual image fetch and conversion logic.
 */
export const filesToBuffer = async (fileUrl: string, fileType: string) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file. Status: ${response.status}`);
    }

    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

    return {
      inlineData: {
        mimeType: fileType,
        data: base64ImageData
      }
    };
  } catch (error) {
    console.error('Error converting file to buffer:', error);
    return null;
  }
};

// Gemini prompt formatter
export const geminiPrompt = (prompt: string) => [
  {
    text: prompt
  }
];

export type GeminiCompletionOptions = {
  model?: string;
  stream?: boolean;
  controllerState?: {
    controllerClosed: boolean;
    enqueue: (chunk: string) => void;
  };
};

/**
 * Handles both streaming and non-streaming Gemini completions.
 *
 * @param prompt - User input text.
 * @param imageUrls - Optional image URLs to include in the prompt.
 * @param options - Configuration for model, streaming, and response handling.
 * @returns The full response text from Gemini.
 */
export async function geminiCompletion(
  prompt: string,
  imageUrls: string[] = [],
  options: GeminiCompletionOptions = {}
): Promise<string> {
  const ai = getGeminiClient();
  const promptData: any[] = geminiPrompt(prompt);
  let resultText = '';
  const supportedFileTypes = [`jpeg`, 'png'];
  // Convert image URLs to inline data
  if (imageUrls?.length > 0) {
    const imageParts = await Promise.all(
      imageUrls.map(async (url) => {
        const urlSplit = url.split('.');
        const fileType = urlSplit.pop()?.toLowerCase().trim() || 'png';
        return await filesToBuffer(
          url,
          `image/${fileType === 'jpg' ? 'jpeg' : supportedFileTypes.includes(fileType) ? fileType : 'jpeg'}`
        );
      })
    );

    promptData.push(...imageParts.filter(Boolean));
  }

  const model = options.model ?? 'gemini-2.5-pro-preview-03-25';
  const mimeType = options.stream ? 'text/plain' : 'application/json';

  try {
    if (options.stream) {
      const response = await ai.models.generateContentStream({
        model,
        contents: [{ role: 'user', parts: promptData }],
        config: { responseMimeType: mimeType }
      });

      for await (const chunk of response) {
        const content = chunk.text;
        if (content) {
          resultText += content;

          try {
            if (
              options.controllerState &&
              !options.controllerState.controllerClosed &&
              typeof options.controllerState.enqueue === 'function'
            ) {
              options.controllerState.enqueue(content);
            }
          } catch (streamError) {
            console.warn('Stream enqueue failed:', streamError);
            if (options.controllerState) {
              options.controllerState.controllerClosed = true;
            }
          }
        }
      }

      if (options.controllerState) {
        options.controllerState.controllerClosed = true;
      }
    } else {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: promptData }],
        config: { responseMimeType: mimeType }
      });

      resultText = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
  } catch (error) {
    console.error('Error during content generation:', error);
    resultText = 'An error occurred while generating content.';
  }

  return resultText;
}
