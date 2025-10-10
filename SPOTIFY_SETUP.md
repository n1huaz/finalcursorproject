# Spotify API Setup Guide

This guide will help you set up the Spotify API integration for your MBTI Personality Content Generator.

## Prerequisites

- A Spotify account (free or premium)
- Node.js installed on your machine

## Step 1: Create a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the application details:
   - **App name**: MBTI Music Generator (or any name you prefer)
   - **App description**: Personality-based music recommendations
   - **Redirect URIs**: `http://localhost:3000` (for local development)
   - **Which API/SDKs are you planning to use?**: Check "Web API"
5. Accept the Terms of Service and click **"Save"**

## Step 2: Get Your Credentials

1. On your app's dashboard page, click **"Settings"**
2. You'll see your **Client ID** - copy this
3. Click **"View client secret"** to reveal your **Client Secret** - copy this
   - ⚠️ **Keep this secret!** Never share it publicly or commit it to git

## Step 3: Create Environment Variables File

1. In your project root directory (`/Users/user/Desktop/final cursor project/`), create a file named `.env.local`

2. Add your Spotify credentials to the file:

```env
# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

3. Replace `your_client_id_here` and `your_client_secret_here` with your actual credentials from Step 2

## Step 4: Verify Setup

Your `.env.local` file should look something like this:

```env
# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=abc123def456ghi789
SPOTIFY_CLIENT_SECRET=xyz987uvw654rst321
```

## Step 5: Start Your Application

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. If it was already running, restart it to load the new environment variables

3. Open your browser to `http://localhost:3000`

4. Select your MBTI type and click "Generate My Personalized Content"

5. You should now see personalized Spotify music recommendations based on your personality type!

## Features

The Spotify integration provides:

- **Personalized Song Recommendations**: Get a single curated song recommendation based on your MBTI type
- **Generate More Songs**: Click "Generate Another Song" to cycle through recommendations from the same batch
- **Fresh Recommendations**: Click "Get Fresh Recommendations" to fetch a completely new set of songs from Spotify
- **Audio Previews**: Listen to 30-second previews of recommended tracks
- **Direct Spotify Links**: Open any track directly in Spotify to listen to the full version

## MBTI to Music Mapping

Each MBTI type gets unique music recommendations based on:

- **Energy Level**: How energetic the music is
- **Valence**: How positive/happy the music sounds
- **Danceability**: How suitable the music is for dancing
- **Genres**: Specific genres that match personality traits

For example:
- **INTJ**: Classical, ambient, electronic, jazz (calm, strategic)
- **ENFP**: Pop, indie, alternative, electronic (energetic, creative)
- **ESTP**: Rock, pop, dance, hip-hop (high energy, action-oriented)

## Troubleshooting

### "Failed to fetch recommendations" error

- Verify your credentials are correct in `.env.local`
- Make sure there are no extra spaces or quotes around the values
- Restart your development server after adding/changing environment variables

### No music previews available

- Some tracks don't have preview URLs available from Spotify
- Click "Open in Spotify" to listen to the full track

### Rate limiting

- Spotify API has rate limits
- If you're making too many requests, wait a few moments and try again

## Security Notes

- ✅ `.env.local` is already in `.gitignore` by default in Next.js
- ✅ Never commit your Client Secret to version control
- ✅ The `NEXT_PUBLIC_` prefix exposes the Client ID to the browser (this is safe)
- ✅ The Client Secret is only used server-side and never exposed to the browser

## Next Steps

You can customize the music recommendations by editing:
- `/Users/user/Desktop/final cursor project/app/api/spotify/recommendations/route.ts` - Modify the MBTI to music mappings

Enjoy your personalized music recommendations! 🎵

