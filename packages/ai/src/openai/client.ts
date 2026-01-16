import OpenAI from 'openai';

// Declare a client variable to hold the OpenAI instance
let client: OpenAI;

/**
 * Initializes and returns the OpenAI client.
 * Ensures a singleton pattern by creating the client only once.
 */
export function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // Uses the API key from environment variables
    });
  }
  return client;
}

export type ChatCompletionContentPart =
  OpenAI.Chat.Completions.ChatCompletionContentPart;

export type ChatCompletionMessageParam =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;
