import { NextResponse } from "next/server";

/**
 * Decodes a JWT payload without external libraries.
 * Used for server-side user identification via the Authorization header.
 */
function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = decodeJwt(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userProfile = {
      name: decoded.name || decoded.sub || 'User',
      email: decoded.email || decoded.sub || '',
      role: decoded.role || 'student',
      plan: decoded.plan || 'Standard',
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
