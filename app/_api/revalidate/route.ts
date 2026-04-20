import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATE_SECRET || 'portfolio-secret-123';

  // This is a simple security check so random bots can't spam your API and drain server resources
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
  }

  try {
    // Revalidate the home page ("/") to instantly refresh the WordPress data
    revalidatePath('/');
    return NextResponse.json({ revalidated: true, message: 'Portfolio cache cleared successfully!', now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating cache' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATE_SECRET || 'portfolio-secret-123';

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
  }

  try {
    revalidatePath('/');
    return NextResponse.json({ revalidated: true, message: 'Portfolio cache cleared successfully!', now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating cache' }, { status: 500 });
  }
}
