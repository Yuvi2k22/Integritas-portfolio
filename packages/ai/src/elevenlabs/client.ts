import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

let client: ElevenLabsClient;

export function getElevenLabsClient() {
  if (!client) {
    client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }

  return client;
}
