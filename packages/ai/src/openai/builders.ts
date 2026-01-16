import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { formatImageUrlsToCompletionMessages } from './helpers';

/**
 * Builder class to help construct chat completion messages.
 */
export class ChatCompletionMessageBuilder {
  private messages: ChatCompletionMessageParam[] = [];

  /**
   * Adds a message to the builder.
   *
   * @param message - The message to add.
   * @returns The builder instance for chaining.
   */
  public addMessage(message: ChatCompletionMessageParam) {
    this.messages.push(message);
    return this;
  }

  /**
   * Adds image urls as a completion message.
   *
   * @param imageUrls array of image urls to be added
   * @returns the builder instance for chaining
   */
  public addImages(imageUrls: string[]) {
    this.messages.push({
      role: 'user',
      content: formatImageUrlsToCompletionMessages(imageUrls)
    });
    return this;
  }

  /**
   * Returns the built array of messages.
   *
   * @returns The messages array.
   */
  public build(): ChatCompletionMessageParam[] {
    return this.messages;
  }

  /**
   * Resets the builder by clearing all messages.
   *
   * @returns The builder instance for chaining.
   */
  public reset(): this {
    this.messages = [];
    return this;
  }
}
