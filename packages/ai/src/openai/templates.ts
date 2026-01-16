import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const NoMarkdownSystemMessage: ChatCompletionMessageParam = {
  role: 'system',
  content: 'You should not use markdown syntax in your responses'
};
