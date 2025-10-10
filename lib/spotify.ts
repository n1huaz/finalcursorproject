// Spotify API utility functions

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECOMMENDATIONS_ENDPOINT = 'https://api.spotify.com/v1/recommendations';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';

function getCredentials() {
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    console.error('Missing Spotify credentials:', {
      client_id: client_id ? 'Set' : 'Missing',
      client_secret: client_secret ? 'Set' : 'Missing'
    });
    throw new Error(
      'Spotify API credentials are not configured. Please add NEXT_PUBLIC_SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env.local file.'
    );
  }

  return { client_id, client_secret };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
}

/**
 * Get Spotify access token using client credentials flow
 */
export async function getAccessToken(): Promise<string> {
  const { client_id, client_secret } = getCredentials();
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Spotify token error:', errorData);
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Get music recommendations using search (more reliable than recommendations endpoint)
 * Each MBTI type gets unique songs based on their genre combination
 */
export async function getRecommendations(params: {
  seed_genres: string[];
  target_energy?: number;
  target_valence?: number;
  target_danceability?: number;
  limit?: number;
}): Promise<SpotifyRecommendations> {
  const accessToken = await getAccessToken();
  const limit = params.limit || 10;
  
  // Use the first genre as primary, but add personality-based keywords
  const primaryGenre = params.seed_genres[0] || 'pop';
  const secondaryGenre = params.seed_genres[1] || '';
  
  // Build descriptive keywords based on energy/valence for variety
  const keywords: string[] = [primaryGenre];
  
  if (secondaryGenre) {
    keywords.push(secondaryGenre);
  }
  
  if (params.target_energy !== undefined) {
    if (params.target_energy > 0.7) {
      keywords.push('upbeat');
    } else if (params.target_energy < 0.4) {
      keywords.push('chill');
    }
  }
  
  if (params.target_valence !== undefined) {
    if (params.target_valence > 0.7) {
      keywords.push('positive');
    } else if (params.target_valence < 0.4) {
      keywords.push('moody');
    }
  }

  // Simple space-separated search works best with Spotify
  const searchQuery = keywords.join(' ');
  
  console.log('Searching for tracks with query:', searchQuery);

  const queryParams = new URLSearchParams({
    q: searchQuery,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`${SEARCH_ENDPOINT}?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Spotify search error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to search tracks: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const tracks = data.tracks?.items || [];
  
  console.log('Search returned:', tracks.length, 'tracks for query:', searchQuery);
  
  return { tracks };
}

/**
 * Search for tracks
 */
export async function searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
  const accessToken = await getAccessToken();
  
  const queryParams = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`${SEARCH_ENDPOINT}?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  const data = await response.json();
  return data.tracks.items;
}

