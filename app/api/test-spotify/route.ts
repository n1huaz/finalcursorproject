import { NextResponse } from 'next/server';

export async function GET() {
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  // Debug info (don't show actual secrets in production!)
  const debugInfo = {
    client_id_exists: !!client_id,
    client_secret_exists: !!client_secret,
    client_id_length: client_id?.length || 0,
    client_secret_length: client_secret?.length || 0,
    client_id_preview: client_id ? `${client_id.substring(0, 8)}...` : 'MISSING',
  };

  console.log('Environment variables check:', debugInfo);

  if (!client_id || !client_secret) {
    return NextResponse.json({
      error: 'Missing credentials',
      debug: debugInfo,
      message: 'Environment variables are not loaded. Did you restart the dev server?'
    }, { status: 500 });
  }

  // Try to get a token
  try {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        error: 'Spotify API error',
        status: response.status,
        details: data,
        debug: debugInfo
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Spotify API connection successful!',
      token_preview: data.access_token ? `${data.access_token.substring(0, 20)}...` : null,
      debug: debugInfo
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Connection error',
      message: error.message,
      debug: debugInfo
    }, { status: 500 });
  }
}

