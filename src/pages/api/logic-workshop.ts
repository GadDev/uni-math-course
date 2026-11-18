import type { APIRoute } from 'astro';
import { smallJson } from '../../lib/auth/policy';
import { workshopRequest } from '../../lib/logic-workshop/grading';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const result = workshopRequest(await smallJson(request, 4096));
  return Response.json(result ?? { error: 'invalid_request' }, {
    status: result ? 200 : 400,
    headers: { 'Cache-Control': 'no-store' },
  });
};
