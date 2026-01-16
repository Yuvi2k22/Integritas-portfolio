import { NextRequest } from 'next/server';
import { ZodSchema } from 'zod';

/**
 * Parses the JSON body of a Next.js request and validates it against a given Zod schema.
 *
 * @template T - The expected shape of the validated data.
 * @param req - The incoming Next.js request object (NextRequest).
 * @param schema - The Zod schema to validate the JSON body against.
 * @returns A promise that resolves to the parsed data if validation succeeds,
 *          or throws a Zod error if validation fails.
 * @throws Will throw a Zod validation error if the request body does not match the schema.
 */
export async function parseJSONRequest<T>(
  req: NextRequest, // Incoming Next.js request object
  schema: ZodSchema<T> // Zod schema used for validation
): Promise<T> {
  // Parse the JSON body from the incoming request
  const jsonBody = await req.json();

  // Validate the parsed JSON body against the provided schema
  const { success, data, error } = schema.safeParse(jsonBody);

  // Return validated data if successful, otherwise throw validation error
  if (success) return data;
  else throw error;
}
