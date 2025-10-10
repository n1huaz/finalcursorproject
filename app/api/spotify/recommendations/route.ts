import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/spotify';

// MBTI to music characteristics mapping
// Valid Spotify genre seeds - https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
const mbtiMusicProfile: Record<string, {
  genres: string[];
  energy: number;
  valence: number;
  danceability: number;
}> = {
  INTJ: {
    genres: ['classical', 'ambient', 'electronic', 'jazz', 'study'],
    energy: 0.4,
    valence: 0.4,
    danceability: 0.3,
  },
  INTP: {
    genres: ['indie', 'alternative', 'electronic', 'jazz', 'idm'],
    energy: 0.5,
    valence: 0.5,
    danceability: 0.4,
  },
  ENTJ: {
    genres: ['rock', 'pop', 'electronic', 'classical', 'work-out'],
    energy: 0.8,
    valence: 0.6,
    danceability: 0.6,
  },
  ENTP: {
    genres: ['indie', 'alternative', 'pop', 'electronic', 'funk'],
    energy: 0.7,
    valence: 0.7,
    danceability: 0.6,
  },
  INFJ: {
    genres: ['ambient', 'indie', 'folk', 'classical', 'singer-songwriter'],
    energy: 0.4,
    valence: 0.5,
    danceability: 0.3,
  },
  INFP: {
    genres: ['indie', 'folk', 'alternative', 'acoustic', 'indie-pop'],
    energy: 0.4,
    valence: 0.6,
    danceability: 0.4,
  },
  ENFJ: {
    genres: ['pop', 'soul', 'indie', 'r-n-b', 'gospel'],
    energy: 0.7,
    valence: 0.8,
    danceability: 0.7,
  },
  ENFP: {
    genres: ['pop', 'indie', 'alternative', 'electronic', 'party'],
    energy: 0.8,
    valence: 0.8,
    danceability: 0.7,
  },
  ISTJ: {
    genres: ['classical', 'country', 'rock', 'folk', 'bluegrass'],
    energy: 0.5,
    valence: 0.5,
    danceability: 0.4,
  },
  ISFJ: {
    genres: ['pop', 'folk', 'country', 'acoustic', 'singer-songwriter'],
    energy: 0.5,
    valence: 0.6,
    danceability: 0.5,
  },
  ESTJ: {
    genres: ['rock', 'country', 'pop', 'classical', 'blues'],
    energy: 0.7,
    valence: 0.6,
    danceability: 0.6,
  },
  ESFJ: {
    genres: ['pop', 'dance', 'soul', 'r-n-b', 'disco'],
    energy: 0.7,
    valence: 0.8,
    danceability: 0.8,
  },
  ISTP: {
    genres: ['rock', 'electronic', 'metal', 'alternative', 'garage'],
    energy: 0.6,
    valence: 0.5,
    danceability: 0.5,
  },
  ISFP: {
    genres: ['indie', 'folk', 'acoustic', 'r-n-b', 'chill'],
    energy: 0.5,
    valence: 0.6,
    danceability: 0.5,
  },
  ESTP: {
    genres: ['rock', 'pop', 'dance', 'hip-hop', 'edm'],
    energy: 0.9,
    valence: 0.7,
    danceability: 0.8,
  },
  ESFP: {
    genres: ['pop', 'dance', 'hip-hop', 'latin', 'party'],
    energy: 0.9,
    valence: 0.9,
    danceability: 0.9,
  },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mbtiType = searchParams.get('mbti')?.toUpperCase();

    console.log('Recommendations API called for MBTI type:', mbtiType);

    if (!mbtiType || !mbtiMusicProfile[mbtiType]) {
      return NextResponse.json(
        { error: 'Invalid MBTI type' },
        { status: 400 }
      );
    }

    const profile = mbtiMusicProfile[mbtiType];
    
    console.log('Fetching recommendations with profile:', {
      genres: profile.genres.slice(0, 5),
      energy: profile.energy,
      valence: profile.valence,
      danceability: profile.danceability
    });

    const recommendations = await getRecommendations({
      seed_genres: profile.genres.slice(0, 5), // Spotify allows max 5 seeds
      target_energy: profile.energy,
      target_valence: profile.valence,
      target_danceability: profile.danceability,
      limit: 10,
    });

    console.log('Successfully fetched', recommendations.tracks?.length || 0, 'tracks');

    return NextResponse.json(recommendations);
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch recommendations',
        message: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

