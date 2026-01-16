/**
 * Asynchronous function that introduces a delay for a specified duration.
 *
 * @param  ms - The time to delay in milliseconds.
 * @returns  A promise that resolves after the specified delay.
 */
export async function asyncTimeDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
