import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, TokenPayload } from '../lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx?: any): Promise<NextResponse> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      const authReq = req as AuthenticatedRequest;
      authReq.user = payload;
      return handler(authReq);
    } catch {
      return NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 });
    }
  };
}