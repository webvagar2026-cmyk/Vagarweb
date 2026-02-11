import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No filename provided' }, { status: 400 });
  }

  try {
    // Read the body into a blob to avoid "body used" or locking issues
    const file = await request.blob();
    console.log(`Uploading file: ${filename}, size: ${file.size} bytes`);

    if (file.size === 0) {
      return NextResponse.json({ message: 'File is empty (0 bytes)' }, { status: 400 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get('url');

  if (!urlToDelete) {
    return NextResponse.json({ message: 'No URL provided' }, { status: 400 });
  }

  try {
    await del(urlToDelete);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    return NextResponse.json({ message: 'Error deleting file' }, { status: 500 });
  }
}
