import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
import {
  ChatCompletionContentPart,
  ChatCompletionMessageParam
} from 'openai/resources/index.mjs';
import { ChatModel } from 'openai/src/resources/index.js';

import { getOpenAIClient } from './client';

/**
 * Formats an array of image URLs into an array of message objects
 * compatible with ChatCompletionContentPart.
 *
 * @param imageUrls - An array of image URLs to be formatted.
 * @returns An array of ChatCompletionContentPart objects, each containing an image URL.
 */
export function formatImageUrlsToCompletionMessages(
  imageUrls: string[]
): ChatCompletionContentPart[] {
  return imageUrls.map((imageUrl) => ({
    type: 'image_url',
    image_url: { url: imageUrl }
  }));
}

export type ChatCompletionOptions = Omit<
  Omit<Omit<ChatCompletionCreateParamsBase, 'stream'>, 'messages'>,
  'model'
>;

/**
 * Creates a chat completion request to OpenAI.
 *
 * @param messages - Array of chat messages forming the conversation history.
 * @param options - Optional parameters for configuring the completion request.
 * @returns The completion response from OpenAI.
 */
export async function createChatCompletion(
  messages: ChatCompletionMessageParam[],
  model: ChatCompletionCreateParamsBase['model'] = 'gpt-4o', // Defaults to 'gpt-4o' if no model is specified
  options?: ChatCompletionOptions
) {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    ...options,
    model,
    stream: true,
    messages
  });
  return response;
}
