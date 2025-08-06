import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(
  req: NextRequest
) {
  return updateSession(req);
}

export const config = {
  matcher: ['/pedidos/:path*'],
};
