import { NextRequest } from 'next/server';
import { subscribeToEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let intervalId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connect signal
      controller.enqueue(encoder.encode(`event: connected\ndata: {"status":"connected"}\n\n`));

      // Subscribe to DB events
      unsubscribe = subscribeToEvents((data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (err) {
          console.error('Error writing to SSE stream:', err);
        }
      });

      // Keepalive heartbeat ping every 20 seconds
      intervalId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (err) {
          if (intervalId) clearInterval(intervalId);
        }
      }, 20000);
    },
    cancel() {
      if (unsubscribe) unsubscribe();
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
