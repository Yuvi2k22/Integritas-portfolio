import { NextResponse } from 'next/server';

import { MediaTypeNames } from '@workspace/common/http';

// Common headers to prevent caching of error responses
const commonHeaders: HeadersInit = {
  'Cache-Control': 'no-store',
  'Content-Type': MediaTypeNames.Application.Json
};

/**
 * Returns a 200 OK response with a streamed body.
 * @param stream ReadableStream to include in the response body.
 * @returns NextResponse with status 200.
 */
export function StreamedTextResponse(stream: ReadableStream) {
  return new NextResponse(stream, {
    status: 200,
    headers: {
      ...commonHeaders,
      'Content-Type': MediaTypeNames.Text.Plain
    }
  });
}

/**
 * Returns a 400 Bad Request response.
 * @param errorBody Optional error message or object to include in the response body.
 * @returns NextResponse with status 400.
 */
export function BadRequestResponse(errorBody?: unknown) {
  const body = JSON.stringify(errorBody || { message: 'Bad Request' });

  return new NextResponse(body, {
    status: 400,
    headers: commonHeaders
  });
}

/**
 * Returns a 401 Unauthorized response.
 * @param errorBody Optional error message or object to include in the response body.
 * @returns NextResponse with status 401.
 */
export function UnauthorizedResponse(errorBody?: unknown) {
  const body = JSON.stringify(errorBody || { message: 'Unauthorized' });

  return new NextResponse(body, {
    status: 401,
    headers: commonHeaders
  });
}

/**
 * Returns a 403 Forbidden response.
 * @param errorBody Optional error message or object to include in the response body.
 * @returns NextResponse with status 403.
 */
export function ForbiddenResponse(errorBody?: unknown) {
  const body = JSON.stringify(errorBody || { message: 'Forbidden' });

  return new NextResponse(body, {
    status: 403,
    headers: commonHeaders
  });
}

/**
 * Returns a 404 Not Found response.
 * @param errorBody Optional error message or object to include in the response body.
 * @returns NextResponse with status 404.
 */
export function NotFoundResponse(errorBody?: unknown) {
  const body = JSON.stringify(errorBody || { message: 'Not Found' });

  return new NextResponse(body, {
    status: 404,
    headers: commonHeaders
  });
}

/**
 * Returns a 409 Conflict response.
 * @param errorBody Optional error message or object to include in the response body.
 * @returns NextResponse with status 409.
 */
export function ConflictResponse(errorBody?: unknown) {
  const body = JSON.stringify(errorBody || { message: 'Conflict' });

  return new NextResponse(body, {
    status: 409,
    headers: commonHeaders
  });
}
