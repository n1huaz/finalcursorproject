'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from "./page.module.css";

interface SpotifyTrack {
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

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': string;
    };
  };
  description: string;
}

function MatrixLoadingScreen() {
  const [matrixChars, setMatrixChars] = useState<string[][]>([]);
  const [, setAnimationFrame] = useState(0);

  useEffect(() => {
    // Initialize matrix characters
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const allChars = chars + katakana;
    
    // Create initial matrix grid
    const initialMatrix: string[][] = [];
    const columns = 80;
    const rows = 40;
    
    for (let col = 0; col < columns; col++) {
      initialMatrix[col] = [];
      for (let row = 0; row < rows; row++) {
        initialMatrix[col][row] = Math.random() > 0.8 ? allChars[Math.floor(Math.random() * allChars.length)] : '';
      }
    }
    
    setMatrixChars(initialMatrix);

    // Animation loop
    const interval = setInterval(() => {
      setMatrixChars(prevMatrix => {
        const newMatrix = prevMatrix.map((column) => {
          return column.map((char) => {
            // Randomly update characters with fade effect
            if (Math.random() > 0.85) {
              return allChars[Math.floor(Math.random() * allChars.length)];
            }
            return char;
          });
        });
        return newMatrix;
      });
      
      setAnimationFrame(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixGrid}>
        {matrixChars.map((column, colIndex) => (
          <div key={colIndex} className={styles.matrixColumn}>
            {column.map((char, rowIndex) => (
              <span
                key={`${colIndex}-${rowIndex}`}
                className={styles.matrixChar}
                style={{
                  opacity: Math.random() > 0.5 ? 1 : 0.3,
                  color: `hsl(${120 + Math.random() * 20}, 100%, ${50 + Math.random() * 30}%)`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.matrixOverlay}>
        <div className={styles.matrixText}>
          <div className={styles.matrixProgress}>
            <div className={styles.matrixProgressBar}></div>
          </div>
          <p>Analyzing personality patterns...</p>
        </div>
      </div>
    </div>
  );
}

function MBTIGenerator() {
  const [mbti, setMbti] = useState({
    energy: 'E',
    information: 'S',
    decision: 'T',
    structure: 'J'
  });
  const [showResults, setShowResults] = useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const [folderOpened, setFolderOpened] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const goBack = () => {
    setShowFolder(false);
    setFolderOpened(false);
    setShowResults(false);
    setIsGenerating(false);
  };
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [pokemonError, setPokemonError] = useState<string | null>(null);

  const currentType = `${mbti.energy}${mbti.information}${mbti.decision}${mbti.structure}`;

  const updateDimension = (dimension: keyof typeof mbti, value: string) => {
    setMbti({ ...mbti, [dimension]: value });
  };

  const fetchPokemonRecommendation = async () => {
    setLoadingPokemon(true);
    setPokemonError(null);
    try {
      // Define Pokemon recommendations for each MBTI type
      const pokemonRecommendations: { [key: string]: number } = {
        INTJ: 150, // Mewtwo - Intelligent and strategic
        INTP: 137, // Porygon - Analytical and logical
        ENTJ: 248, // Tyranitar - Powerful and commanding
        ENTP: 149, // Dragonite - Innovative and adaptable
        INFJ: 144, // Articuno - Mystical and wise
        INFP: 151, // Mew - Dreamy and creative
        ENFJ: 145, // Zapdos - Inspiring and protective
        ENFP: 146, // Moltres - Enthusiastic and dynamic
        ISTJ: 143, // Snorlax - Reliable and methodical
        ISFJ: 131, // Lapras - Caring and supportive
        ESTJ: 147, // Dratini - Organized and authoritative
        ESFJ: 132, // Ditto - Helpful and traditional
        ISTP: 142, // Aerodactyl - Practical and independent
        ISFP: 133, // Eevee - Artistic and gentle
        ESTP: 134, // Vaporeon - Energetic and action-oriented
        ESFP: 135, // Jolteon - Fun-loving and social
      };

      const pokemonId = pokemonRecommendations[currentType] || 150; // Default to Mewtwo
      
      const response = await fetch(`/api/pokemon?id=${pokemonId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPokemon(data);
        setPokemonError(null);
      } else {
        setPokemonError(data.error || 'Failed to fetch Pokemon');
        setPokemon(null);
      }
    } catch (error: unknown) {
      console.error('Error fetching Pokemon:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error - please check your connection';
      setPokemonError(errorMessage);
      setPokemon(null);
    } finally {
      setLoadingPokemon(false);
    }
  };

  const fetchSpotifyRecommendations = async () => {
    setLoadingMusic(true);
    setSpotifyError(null);
    try {
      const response = await fetch(`/api/spotify/recommendations?mbti=${currentType}`);
      const data = await response.json();
      
      if (response.ok) {
        const tracks = data.tracks || [];
        
        // Shuffle tracks to ensure variety each time
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
        
        setSpotifyTracks(shuffledTracks);
        setCurrentTrackIndex(0);
        setSpotifyError(null);
      } else {
        console.error('API Error:', data);
        setSpotifyError(data.message || data.error || 'Failed to fetch recommendations');
        setSpotifyTracks([]);
      }
    } catch (error: unknown) {
      console.error('Error fetching Spotify recommendations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error - please check your connection';
      setSpotifyError(errorMessage);
      setSpotifyTracks([]);
    } finally {
      setLoadingMusic(false);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    setShowFolder(true);
    setFolderOpened(false);
    setShowResults(false);
    
    // Simulate loading time with Matrix animation
    setTimeout(async () => {
      await Promise.all([
        fetchSpotifyRecommendations(),
        fetchPokemonRecommendation()
      ]);
      setIsGenerating(false);
      
      setTimeout(() => {
        document.getElementById('folder')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 3000); // 3 seconds of Matrix animation
  };

  const openFolder = () => {
    setFolderOpened(true);
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const getNextSong = () => {
    if (spotifyTracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % spotifyTracks.length);
    }
  };

  const downloadFolder = () => {
    const content = mbtiContent;
    const type = currentType;
    
    let textContent = `${type} PERSONALITY INSIGHTS\n`;
    textContent += `${'='.repeat(50)}\n\n`;
    
    // Best Cities to Live
    textContent += `🌆 BEST CITIES TO LIVE:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    content.cities[type].forEach((city: string, i: number) => {
      textContent += `${i + 1}. ${city}\n`;
    });
    textContent += `\n`;
    
    // Hobbies
    textContent += `🎨 HOBBY RECOMMENDATIONS:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    content.hobbies[type].forEach((hobby: string) => {
      textContent += `• ${hobby}\n`;
    });
    textContent += `\n`;
    
    // Learning Style
    textContent += `📚 LEARNING STYLE:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    textContent += `${content.learning[type].replace(/<strong>/g, '').replace(/<\/strong>/g, '')}\n\n`;
    
    // Communication
    textContent += `🤝 COMMUNICATION TIPS:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    textContent += `${content.communication[type]}\n\n`;
    
    // Strengths
    textContent += `⚡ STRENGTHS:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    content.strengths[type].forEach((strength: string) => {
      textContent += `• ${strength}\n`;
    });
    textContent += `\n`;
    
    // Growth Areas
    textContent += `🌱 GROWTH AREAS:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    content.growth[type].forEach((area: string) => {
      textContent += `• ${area}\n`;
    });
    textContent += `\n`;
    
    // Horoscope
    textContent += `🔮 YOUR HOROSCOPE:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    textContent += `${content.horoscope[type].replace(/<strong>/g, '').replace(/<\/strong>/g, '')}\n\n`;
    
    // Environment
    textContent += `🎯 IDEAL ENVIRONMENT:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    textContent += `${content.environment[type]}\n\n`;
    
    // Careers
    textContent += `💼 CAREER SUGGESTIONS:\n`;
    textContent += `${'-'.repeat(50)}\n`;
    content.careers[type].forEach((career: string) => {
      textContent += `• ${career}\n`;
    });
    textContent += `\n`;
    
    // Spotify Track
    if (spotifyTracks.length > 0) {
      const track = spotifyTracks[currentTrackIndex];
      textContent += `🎵 YOUR RECOMMENDED SONG:\n`;
      textContent += `${'-'.repeat(50)}\n`;
      textContent += `Song: ${track.name}\n`;
      textContent += `Artist: ${track.artists.map(a => a.name).join(', ')}\n`;
      textContent += `Album: ${track.album.name}\n`;
      textContent += `Listen: ${track.external_urls.spotify}\n\n`;
    }
    
    textContent += `${'='.repeat(50)}\n`;
    textContent += `Generated by MBTI Personality Lifestyle Generator\n`;
    
    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_Personality_Insights.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {(showFolder || folderOpened || showResults) && (
        <button onClick={goBack} className={styles.backButton}>
          ← Back
        </button>
      )}
      <header className={styles.header}>
        <h1>🧠 MBTI Personality Lifestyle Generator</h1>
      </header>

      {!showFolder && (
        <div className={styles.inputSection}>
          <div className={styles.mbtiSelector}>
            <div className={styles.dimensionGrid}>
              <div className={styles.dimensionGroup}>
                <div className={styles.dimensionGroupTitle}>Energy</div>
                <div className={styles.dimensionGroupButtons}>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.energy === 'E' ? styles.selected : ''}`}
                    onClick={() => updateDimension('energy', 'E')}
                  >
                    E
                  </button>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.energy === 'I' ? styles.selected : ''}`}
                    onClick={() => updateDimension('energy', 'I')}
                  >
                    I
                  </button>
                </div>
              </div>
              <div className={styles.dimensionGroup}>
                <div className={styles.dimensionGroupTitle}>Information</div>
                <div className={styles.dimensionGroupButtons}>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.information === 'S' ? styles.selected : ''}`}
                    onClick={() => updateDimension('information', 'S')}
                  >
                    S
                  </button>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.information === 'N' ? styles.selected : ''}`}
                    onClick={() => updateDimension('information', 'N')}
                  >
                    N
                  </button>
                </div>
              </div>
              <div className={styles.dimensionGroup}>
                <div className={styles.dimensionGroupTitle}>Decision</div>
                <div className={styles.dimensionGroupButtons}>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.decision === 'T' ? styles.selected : ''}`}
                    onClick={() => updateDimension('decision', 'T')}
                  >
                    T
                  </button>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.decision === 'F' ? styles.selected : ''}`}
                    onClick={() => updateDimension('decision', 'F')}
                  >
                    F
                  </button>
                </div>
              </div>
              <div className={styles.dimensionGroup}>
                <div className={styles.dimensionGroupTitle}>Structure</div>
                <div className={styles.dimensionGroupButtons}>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.structure === 'J' ? styles.selected : ''}`}
                    onClick={() => updateDimension('structure', 'J')}
                  >
                    J
                  </button>
                  <button 
                    className={`${styles.dimensionBtn} ${mbti.structure === 'P' ? styles.selected : ''}`}
                    onClick={() => updateDimension('structure', 'P')}
                  >
                    P
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.currentType}>
              <span>Your Type:</span>
              <span className={styles.typeBadge}>{currentType}</span>
            </div>
            <button onClick={generateContent} className={styles.generateBtn}>
              Generate {currentType} Lifestyle
            </button>
          </div>
        </div>
      )}

      {isGenerating && createPortal(
        <MatrixLoadingScreen />,
        document.body
      )}

      {showFolder && !folderOpened && !isGenerating && (
        <div id="folder" className={styles.folderSection}>
          <div className={styles.folderContainer} onDoubleClick={openFolder}>
            <div className={styles.folderIcon}>
              <svg viewBox="0 0 100 80" className={styles.folderSvg}>
                <path d="M0,10 L0,70 Q0,75 5,75 L95,75 Q100,75 100,70 L100,20 Q100,15 95,15 L50,15 L45,5 Q43,0 38,0 L5,0 Q0,0 0,5 Z" 
                      fill="#FFD166" stroke="#D4A044" strokeWidth="2"/>
                <path d="M0,20 L100,20" stroke="#D4A044" strokeWidth="1" opacity="0.5"/>
              </svg>
            </div>
            <div className={styles.folderLabel}>
              {currentType} Personality Insights
            </div>
            <div className={styles.doubleClickHint}>
              Double-click to open
            </div>
          </div>
          <button onClick={downloadFolder} className={styles.downloadBtn}>
            💾 Download Folder
          </button>
        </div>
      )}

      {showResults && folderOpened && (
        <div id="results" className={styles.resultsSection}>
          <h2>Your Personalized Insights</h2>
          <div className={styles.resultsGrid}>
            {/* Spotify Music Card - First */}
            <SpotifyMusicCard 
              loadingMusic={loadingMusic}
              spotifyError={spotifyError}
              spotifyTracks={spotifyTracks}
              currentTrackIndex={currentTrackIndex}
              getNextSong={getNextSong}
              fetchSpotifyRecommendations={fetchSpotifyRecommendations}
            />
            
            <CitiesCard
              cities={mbtiContent.cities[currentType]}
            />
            
            <WeatherCard
              topCity={mbtiContent.cities[currentType][0].split(' - ')[0]}
              topCityCoords={cityCoordinates[mbtiContent.cities[currentType][0].split(' - ')[0]]}
            />
            
            <TarotCard
              content={mbtiContent.horoscope[currentType]}
            />
            
            <LuckyColorCard
              mbtiType={currentType}
            />
                <TypographyCard
                  mbtiType={currentType}
                />
                
                <PokemonCard
                  pokemon={pokemon}
                  loadingPokemon={loadingPokemon}
                  pokemonError={pokemonError}
                  fetchPokemonRecommendation={fetchPokemonRecommendation}
                />
              </div>
            </div>
          )}
    </div>
  );
}

function DimensionSelector({ label, options, selected, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.dimension}>
      <label>{label}</label>
      <div className={styles.buttonGroup}>
        {options.map(opt => (
          <button
            key={opt.value}
            className={`${styles.dimensionBtn} ${selected === opt.value ? styles.active : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ icon, title, content, isText = false }: {
  icon: string;
  title: string;
  content: string | string[];
  isText?: boolean;
}) {
  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>{icon}</span>
        {title}
      </h3>
      <div className={styles.cardContent}>
        {isText ? (
          <p dangerouslySetInnerHTML={{ __html: content as string }} />
        ) : (
          <ul>
            {(content as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SpotifyMusicCard({ 
  loadingMusic, 
  spotifyError, 
  spotifyTracks, 
  currentTrackIndex,
  getNextSong,
  fetchSpotifyRecommendations 
}: {
  loadingMusic: boolean;
  spotifyError: string | null;
  spotifyTracks: SpotifyTrack[];
  currentTrackIndex: number;
  getNextSong: () => void;
  fetchSpotifyRecommendations: () => void;
}) {
  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🎵</span>
        Your Recommended Song
      </h3>
      <div className={styles.cardContent}>
        {loadingMusic ? (
          <div className={styles.spotifyLoading}>Loading music...</div>
        ) : spotifyError ? (
          <div className={styles.spotifyError}>
            <p>⚠️ {spotifyError}</p>
            <button onClick={fetchSpotifyRecommendations} className={styles.spotifyRetryBtn}>
              Retry
            </button>
          </div>
        ) : spotifyTracks.length > 0 ? (
          <div className={styles.compactSpotifyCard}>
            {spotifyTracks[currentTrackIndex].album.images[0] && (
              <img 
                src={spotifyTracks[currentTrackIndex].album.images[0].url} 
                alt={spotifyTracks[currentTrackIndex].album.name}
                className={styles.compactAlbumArt}
              />
            )}
            <div className={styles.compactTrackInfo}>
              <h4 className={styles.compactTrackName}>
                {spotifyTracks[currentTrackIndex].name}
              </h4>
              <p className={styles.compactArtist}>
                {spotifyTracks[currentTrackIndex].artists.map(a => a.name).join(', ')}
              </p>
            </div>
            <div className={styles.compactControls}>
              <button onClick={getNextSong} className={styles.compactBtn}>
                🎲 Next
              </button>
              <a 
                href={spotifyTracks[currentTrackIndex].external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.compactSpotifyBtn}
              >
                ▶ Play
              </a>
            </div>
          </div>
        ) : (
          <p className={styles.spotifyEmpty}>No music available</p>
        )}
      </div>
    </div>
  );
}

// City coordinates for map and weather display
const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
  'Boston, MA': { lat: 42.3601, lon: -71.0589 },
  'Seattle, WA': { lat: 47.6062, lon: -122.3321 },
  'Berlin, Germany': { lat: 52.5200, lon: 13.4050 },
  'Tokyo, Japan': { lat: 35.6762, lon: 139.6503 },
  'Austin, TX': { lat: 30.2672, lon: -97.7431 },
  'San Francisco, CA': { lat: 37.7749, lon: -122.4194 },
  'Cambridge, MA': { lat: 42.3736, lon: -71.1097 },
  'Portland, OR': { lat: 45.5152, lon: -122.6784 },
  'Amsterdam, Netherlands': { lat: 52.3676, lon: 4.9041 },
  'Stockholm, Sweden': { lat: 59.3293, lon: 18.0686 },
  'New York, NY': { lat: 40.7128, lon: -74.0060 },
  'Singapore': { lat: 1.3521, lon: 103.8198 },
  'London, UK': { lat: 51.5074, lon: -0.1278 },
  'Hong Kong': { lat: 22.3193, lon: 114.1694 },
  'Chicago, IL': { lat: 41.8781, lon: -87.6298 },
  'Tel Aviv, Israel': { lat: 32.0853, lon: 34.7818 },
  'Barcelona, Spain': { lat: 41.3851, lon: 2.1734 },
  'Santa Fe, NM': { lat: 35.6870, lon: -105.9378 },
  'Kyoto, Japan': { lat: 35.0116, lon: 135.7681 },
  'Edinburgh, Scotland': { lat: 55.9533, lon: -3.1883 },
  'Boulder, CO': { lat: 40.0150, lon: -105.2705 },
  'Asheville, NC': { lat: 35.5951, lon: -82.5515 },
  'Reykjavik, Iceland': { lat: 64.1466, lon: -21.9426 },
  'Santa Cruz, CA': { lat: 36.9741, lon: -122.0308 },
  'Prague, Czech Republic': { lat: 50.0755, lon: 14.4378 },
  'Washington, DC': { lat: 38.9072, lon: -77.0369 },
  'Geneva, Switzerland': { lat: 46.2044, lon: 6.1432 },
  'Copenhagen, Denmark': { lat: 55.6761, lon: 12.5683 },
  'Vancouver, Canada': { lat: 49.2827, lon: -123.1207 },
  'Dublin, Ireland': { lat: 53.3498, lon: -6.2603 },
  'Melbourne, Australia': { lat: -37.8136, lon: 144.9631 },
  'Montreal, Canada': { lat: 45.5017, lon: -73.5673 },
  'Minneapolis, MN': { lat: 44.9778, lon: -93.2650 },
  'Zurich, Switzerland': { lat: 47.3769, lon: 8.5417 },
  'Munich, Germany': { lat: 48.1351, lon: 11.5820 },
  'Charlotte, NC': { lat: 35.2271, lon: -80.8431 },
  'Madison, WI': { lat: 43.0731, lon: -89.4012 },
  'Portland, ME': { lat: 43.6591, lon: -70.2568 },
  'Vienna, Austria': { lat: 48.2082, lon: 16.3738 },
  'Nashville, TN': { lat: 36.1627, lon: -86.7816 },
  'Dallas, TX': { lat: 32.7767, lon: -96.7970 },
  'Frankfurt, Germany': { lat: 50.1109, lon: 8.6821 },
  'Houston, TX': { lat: 29.7604, lon: -95.3698 },
  'Atlanta, GA': { lat: 33.7490, lon: -84.3880 },
  'Salt Lake City, UT': { lat: 40.7608, lon: -111.8910 },
  'San Diego, CA': { lat: 32.7157, lon: -117.1611 },
  'Charleston, SC': { lat: 32.7765, lon: -79.9311 },
  'Denver, CO': { lat: 39.7392, lon: -104.9903 },
  'Auckland, New Zealand': { lat: -36.8485, lon: 174.7633 },
  'Phoenix, AZ': { lat: 33.4484, lon: -112.0740 },
  'Florence, Italy': { lat: 43.7696, lon: 11.2558 },
  'Byron Bay, Australia': { lat: -28.6474, lon: 153.6020 },
  'Sedona, AZ': { lat: 34.8697, lon: -111.7610 },
  'Savannah, GA': { lat: 32.0809, lon: -81.0912 },
  'Las Vegas, NV': { lat: 36.1699, lon: -115.1398 },
  'Miami, FL': { lat: 25.7617, lon: -80.1918 },
  'Dubai, UAE': { lat: 25.2048, lon: 55.2708 },
  'Los Angeles, CA': { lat: 34.0522, lon: -118.2437 },
  'Sydney, Australia': { lat: -33.8688, lon: 151.2093 },
  'New Orleans, LA': { lat: 29.9511, lon: -90.0715 },
  'Rio de Janeiro, Brazil': { lat: -22.9068, lon: -43.1729 },
  'Ibiza, Spain': { lat: 38.9067, lon: 1.4206 },
};

function WeatherCard({ topCity, topCityCoords }: { topCity: string; topCityCoords: { lat: number; lon: number } }) {
  const [weather, setWeather] = useState<{
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    city: string;
    icon: string;
    feelsLike: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/weather?lat=${topCityCoords.lat}&lon=${topCityCoords.lon}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err: unknown) {
        console.error('Weather fetch error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unable to load weather data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [topCity, topCityCoords]);

  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🌤️</span>
        Current Weather in {topCity}
      </h3>
      <div className={styles.cardContent}>
        {loading ? (
          <div className={styles.weatherLoading}>Loading weather...</div>
        ) : error ? (
          <div className={styles.weatherError}>
            <p>⚠️ {error}</p>
          </div>
        ) : weather ? (
          <div className={styles.weatherDisplay}>
            <div className={styles.weatherMain}>
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather.description}
                className={styles.weatherIcon}
              />
              <div className={styles.weatherTemp}>
                {Math.round(weather.temperature)}°C
              </div>
            </div>
            <div className={styles.weatherDesc}>
              {weather.description}
            </div>
            <div className={styles.weatherDetails}>
              <div className={styles.weatherDetail}>
                <span className={styles.weatherLabel}>Feels like:</span>
                <span>{Math.round(weather.feelsLike)}°C</span>
              </div>
              <div className={styles.weatherDetail}>
                <span className={styles.weatherLabel}>Humidity:</span>
                <span>{weather.humidity}%</span>
              </div>
              <div className={styles.weatherDetail}>
                <span className={styles.weatherLabel}>Wind:</span>
                <span>{weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.weatherEmpty}>No weather data available</div>
        )}
      </div>
    </div>
  );
}

function TarotCard({ content }: { content: string }) {
  // Generate a random tarot card each time
  const tarotCards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];
  
  const cardIndex = Math.floor(Math.random() * tarotCards.length);
  const selectedCard = tarotCards[cardIndex];

  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🔮</span>
        Your Tarot Reading
      </h3>
      <div className={styles.cardContent}>
        <div className={styles.tarotDisplay}>
          <div className={styles.tarotCard}>
            <div className={styles.tarotCardInner}>
              <div className={styles.tarotCardTitle}>{selectedCard}</div>
              <div className={styles.tarotCardSymbol}>🃏</div>
            </div>
          </div>
          <div className={styles.tarotReading}>
            <p dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonCard({ 
  pokemon, 
  loadingPokemon, 
  pokemonError, 
  fetchPokemonRecommendation 
}: {
  pokemon: Pokemon | null;
  loadingPokemon: boolean;
  pokemonError: string | null;
  fetchPokemonRecommendation: () => void;
}) {
  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🎮</span>
        Your Pokemon Partner
      </h3>
      <div className={styles.cardContent}>
        {loadingPokemon ? (
          <div className={styles.pokemonLoading}>Loading Pokemon...</div>
        ) : pokemonError ? (
          <div className={styles.pokemonError}>
            <p>⚠️ {pokemonError}</p>
            <button onClick={fetchPokemonRecommendation} className={styles.pokemonRetryBtn}>
              Try Again
            </button>
          </div>
        ) : pokemon ? (
          <div className={styles.pokemonDisplay}>
            <div className={styles.pokemonImage}>
              <img 
                src={pokemon.sprites.other['official-artwork'] || pokemon.sprites.front_default} 
                alt={pokemon.name}
                className={styles.pokemonSprite}
              />
            </div>
            <div className={styles.pokemonInfo}>
              <h4 className={styles.pokemonName}>
                #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h4>
              <div className={styles.pokemonTypes}>
                {pokemon.types.map((type, index) => (
                  <span key={index} className={styles.pokemonType}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                ))}
              </div>
              <div className={styles.pokemonStats}>
                <div className={styles.statRow}>
                  <span>HP: {pokemon.stats.hp}</span>
                  <span>Attack: {pokemon.stats.attack}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Defense: {pokemon.stats.defense}</span>
                  <span>Speed: {pokemon.stats.speed}</span>
                </div>
              </div>
              <p className={styles.pokemonDescription}>
                {pokemon.description}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TypographyCard({ mbtiType }: { mbtiType: string }) {
  // Define typography recommendations for each MBTI type
  const typographyRecommendations: { [key: string]: { 
    primary: { name: string; description: string; use: string; };
    secondary: { name: string; description: string; use: string; };
    reasoning: string;
  } } = {
    INTJ: {
      primary: { 
        name: 'Inter', 
        description: 'A geometric sans-serif optimized for computer screens',
        use: 'Professional documents, presentations, coding interfaces'
      },
      secondary: { 
        name: 'JetBrains Mono', 
        description: 'A developer-focused monospace font with ligatures',
        use: 'Programming, technical documentation, data analysis'
      },
      reasoning: 'Your analytical mind benefits from clean, precise typography that enhances readability and maintains focus during long work sessions.'
    },
    INTP: {
      primary: { 
        name: 'Source Code Pro', 
        description: 'A monospace font designed for coding environments',
        use: 'Programming, research notes, technical writing'
      },
      secondary: { 
        name: 'Roboto Mono', 
        description: 'A monospace font with excellent character distinction',
        use: 'Data analysis, algorithm documentation, system logs'
      },
      reasoning: 'Your logical processing style works best with monospace fonts that provide consistent spacing and clear character distinction.'
    },
    ENTJ: {
      primary: { 
        name: 'Montserrat', 
        description: 'A geometric sans-serif with strong visual presence',
        use: 'Executive presentations, leadership communications, strategic plans'
      },
      secondary: { 
        name: 'Playfair Display', 
        description: 'An elegant serif with commanding authority',
        use: 'Formal reports, executive summaries, public statements'
      },
      reasoning: 'Your leadership nature requires typography that commands attention and conveys authority while maintaining professional clarity.'
    },
    ENTP: {
      primary: { 
        name: 'Poppins', 
        description: 'A friendly geometric sans-serif with creative flair',
        use: 'Innovation proposals, creative presentations, brainstorming materials'
      },
      secondary: { 
        name: 'Space Grotesk', 
        description: 'A variable font with modern, experimental character',
        use: 'Design mockups, experimental projects, tech startups'
      },
      reasoning: 'Your innovative spirit thrives with modern, adaptable fonts that can express creativity while maintaining technical precision.'
    },
    INFJ: {
      primary: { 
        name: 'Crimson Text', 
        description: 'A readable serif optimized for long-form reading',
        use: 'Personal journals, reflective writing, philosophical texts'
      },
      secondary: { 
        name: 'Lora', 
        description: 'A well-balanced serif with emotional warmth',
        use: 'Poetry, personal essays, meaningful communications'
      },
      reasoning: 'Your intuitive nature benefits from typography that feels warm and human, encouraging deep reflection and emotional connection.'
    },
    INFP: {
      primary: { 
        name: 'Merriweather', 
        description: 'A serif designed for enjoyable reading on screens',
        use: 'Creative writing, personal blogs, artistic statements'
      },
      secondary: { 
        name: 'Crimson Pro', 
        description: 'An elegant serif with artistic character',
        use: 'Poetry, personal narratives, creative portfolios'
      },
      reasoning: 'Your artistic soul connects with typography that has personality and warmth, inspiring creative expression and authentic communication.'
    },
    ENFJ: {
      primary: { 
        name: 'Open Sans', 
        description: 'A humanist sans-serif designed for accessibility',
        use: 'Educational materials, community communications, social impact projects'
      },
      secondary: { 
        name: 'Libre Baskerville', 
        description: 'A web serif optimized for comfortable reading',
        use: 'Mentoring documents, inspirational content, team communications'
      },
      reasoning: 'Your people-focused nature requires typography that is inclusive, accessible, and warm—fonts that make everyone feel welcome.'
    },
    ENFP: {
      primary: { 
        name: 'Nunito', 
        description: 'A rounded sans-serif with friendly, approachable character',
        use: 'Social media content, community events, creative collaborations'
      },
      secondary: { 
        name: 'Quicksand', 
        description: 'A sans-serif with playful, energetic personality',
        use: 'Event announcements, creative projects, team building materials'
      },
      reasoning: 'Your enthusiastic personality shines through typography that is friendly, energetic, and approachable—fonts that invite connection.'
    },
    ISTJ: {
      primary: { 
        name: 'IBM Plex Sans', 
        description: 'A corporate typeface designed for clarity and reliability',
        use: 'Business reports, procedural documents, compliance materials'
      },
      secondary: { 
        name: 'Source Serif Pro', 
        description: 'A serif designed for comfortable reading of long documents',
        use: 'Legal documents, technical manuals, detailed reports'
      },
      reasoning: 'Your methodical approach benefits from typography that prioritizes clarity, consistency, and professional reliability.'
    },
    ISFJ: {
      primary: { 
        name: 'PT Serif', 
        description: 'A serif designed for comfortable reading',
        use: 'Care documentation, patient materials, support resources'
      },
      secondary: { 
        name: 'Source Sans Pro', 
        description: 'A clean sans-serif optimized for web readability',
        use: 'Healthcare communications, educational materials, community resources'
      },
      reasoning: 'Your caring nature requires typography that is gentle, clear, and supportive—fonts that make information accessible and comforting.'
    },
    ESTJ: {
      primary: { 
        name: 'Helvetica Neue', 
        description: 'A classic sans-serif with authoritative presence',
        use: 'Corporate communications, management reports, organizational charts'
      },
      secondary: { 
        name: 'Times New Roman', 
        description: 'A traditional serif with formal authority',
        use: 'Legal documents, official correspondence, formal presentations'
      },
      reasoning: 'Your organized leadership style benefits from established, authoritative typography that conveys structure and professional competence.'
    },
    ESFJ: {
      primary: { 
        name: 'Roboto', 
        description: 'A friendly sans-serif designed for modern interfaces',
        use: 'Social media management, community newsletters, event planning'
      },
      secondary: { 
        name: 'PT Sans', 
        description: 'A humanist sans-serif with warm, approachable character',
        use: 'Team communications, social events, community announcements'
      },
      reasoning: 'Your social nature thrives with typography that is warm, friendly, and approachable—fonts that build community and connection.'
    },
    ISTP: {
      primary: { 
        name: 'Fira Code', 
        description: 'A monospace font with programming ligatures',
        use: 'Technical documentation, system administration, troubleshooting guides'
      },
      secondary: { 
        name: 'Consolas', 
        description: 'A monospace font designed for programming',
        use: 'Code reviews, technical specifications, diagnostic reports'
      },
      reasoning: 'Your hands-on approach benefits from technical typography that prioritizes functionality and precision over decoration.'
    },
    ISFP: {
      primary: { 
        name: 'Libre Baskerville', 
        description: 'A web serif with artistic character and warmth',
        use: 'Creative portfolios, personal websites, artistic statements'
      },
      secondary: { 
        name: 'Karla', 
        description: 'A friendly sans-serif with subtle personality',
        use: 'Personal blogs, creative projects, individual communications'
      },
      reasoning: 'Your artistic sensibility connects with typography that has character and warmth, reflecting your authentic, individual style.'
    },
    ESTP: {
      primary: { 
        name: 'Montserrat', 
        description: 'A bold geometric sans-serif with strong visual impact',
        use: 'Marketing materials, event promotions, dynamic presentations'
      },
      secondary: { 
        name: 'Oswald', 
        description: 'A condensed sans-serif with energetic presence',
        use: 'Social media graphics, quick communications, action-oriented content'
      },
      reasoning: 'Your dynamic nature requires typography that makes an immediate impact and conveys energy and action.'
    },
    ESFP: {
      primary: { 
        name: 'Nunito', 
        description: 'A rounded sans-serif with friendly, energetic character',
        use: 'Event promotions, social media content, party invitations'
      },
      secondary: { 
        name: 'Fredoka One', 
        description: 'A playful display font with fun, approachable personality',
        use: 'Creative projects, social gatherings, entertainment content'
      },
      reasoning: 'Your fun-loving personality shines through typography that is playful, energetic, and inviting—fonts that celebrate life and connection.'
    }
  };

  const rec = typographyRecommendations[mbtiType] || {
    primary: { 
      name: 'Inter', 
      description: 'A versatile sans-serif optimized for digital reading',
      use: 'General purpose, web content, professional documents'
    },
    secondary: { 
      name: 'Source Serif Pro', 
      description: 'A serif designed for comfortable reading',
      use: 'Long-form content, reports, documentation'
    },
    reasoning: 'Your unique personality benefits from typography that balances clarity with character, supporting both professional and personal expression.'
  };

  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🔤</span>
        Recommended Typography
      </h3>
      <div className={styles.cardContent}>
        <div className={styles.typographyDisplay}>
          <div className={styles.fontSection}>
            <h4 className={styles.fontSectionTitle}>Primary Font</h4>
            <div className={styles.fontCard}>
              <div className={styles.fontName}>{rec.primary.name}</div>
              <div className={styles.fontDescription}>{rec.primary.description}</div>
              <div className={styles.fontUse}>
                <strong>Best for:</strong> {rec.primary.use}
              </div>
            </div>
          </div>
          <div className={styles.fontSection}>
            <h4 className={styles.fontSectionTitle}>Secondary Font</h4>
            <div className={styles.fontCard}>
              <div className={styles.fontName}>{rec.secondary.name}</div>
              <div className={styles.fontDescription}>{rec.secondary.description}</div>
              <div className={styles.fontUse}>
                <strong>Best for:</strong> {rec.secondary.use}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.typographyReasoning}>
          <p>{rec.reasoning}</p>
          <div className={styles.freetypeNote}>
            <em>Inspired by <a href="https://freetype.org" target="_blank" rel="noopener noreferrer">FreeType</a> font rendering technology</em>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilmsTVCard({ mbtiType }: { mbtiType: string }) {
  // Define recommended films and TV shows for each MBTI type
  const recommendations: { [key: string]: { films: string[]; tvShows: string[] } } = {
    INTJ: {
      films: ['Inception', 'Blade Runner 2049', 'The Matrix', 'Ex Machina', 'Interstellar'],
      tvShows: ['Westworld', 'Black Mirror', 'True Detective', 'The Wire', 'Mindhunter']
    },
    INTP: {
      films: ['Her', 'The Social Network', 'Primer', '2001: A Space Odyssey', 'Being John Malkovich'],
      tvShows: ['Rick and Morty', 'The Big Bang Theory', 'Sherlock', 'House M.D.', 'Cosmos']
    },
    ENTJ: {
      films: ['The Wolf of Wall Street', 'Gladiator', 'The Godfather', 'Scarface', 'Wall Street'],
      tvShows: ['Succession', 'House of Cards', 'Billions', 'The Crown', 'Mad Men']
    },
    ENTP: {
      films: ['Deadpool', 'The Grand Budapest Hotel', 'Inception', 'Fight Club', 'The Truman Show'],
      tvShows: ['Arrested Development', 'Community', 'It\'s Always Sunny in Philadelphia', 'Silicon Valley', 'The Office']
    },
    INFJ: {
      films: ['The Shawshank Redemption', 'Good Will Hunting', 'The Green Mile', 'Forrest Gump', 'Dead Poets Society'],
      tvShows: ['This Is Us', 'The Good Place', 'Parenthood', 'Friday Night Lights', 'Atypical']
    },
    INFP: {
      films: ['Eternal Sunshine of the Spotless Mind', 'Amélie', 'Her', 'Lost in Translation', 'Little Miss Sunshine'],
      tvShows: ['Gilmore Girls', 'Anne with an E', 'The Office', 'Friends', 'Parks and Recreation']
    },
    ENFJ: {
      films: ['The Pursuit of Happyness', 'Dead Poets Society', 'Freedom Writers', 'Pay It Forward', 'Good Will Hunting'],
      tvShows: ['This Is Us', 'The Good Doctor', 'Grey\'s Anatomy', 'A Million Little Things', 'Virgin River']
    },
    ENFP: {
      films: ['La La Land', 'The Secret Life of Walter Mitty', 'Amélie', 'Up', 'The Greatest Showman'],
      tvShows: ['New Girl', 'Brooklyn Nine-Nine', 'Parks and Recreation', 'Schitt\'s Creek', 'The Good Place']
    },
    ISTJ: {
      films: ['Forrest Gump', 'The King\'s Speech', 'Saving Private Ryan', 'Apollo 13', 'The Terminal'],
      tvShows: ['NCIS', 'Law & Order', 'Blue Bloods', 'The West Wing', 'Madam Secretary']
    },
    ISFJ: {
      films: ['The Help', 'Little Women', 'Pride and Prejudice', 'The Sound of Music', 'Mrs. Doubtfire'],
      tvShows: ['Call the Midwife', 'Downton Abbey', 'The Crown', 'Heartland', 'Virgin River']
    },
    ESTJ: {
      films: ['The Wolf of Wall Street', 'Gladiator', 'Braveheart', 'Top Gun', 'Die Hard'],
      tvShows: ['Succession', 'Billions', 'House of Cards', 'The Crown', 'Mad Men']
    },
    ESFJ: {
      films: ['The Help', 'Little Women', 'The Sound of Music', 'Mrs. Doubtfire', 'My Big Fat Greek Wedding'],
      tvShows: ['Friends', 'How I Met Your Mother', 'The Big Bang Theory', 'Modern Family', 'This Is Us']
    },
    ISTP: {
      films: ['Mad Max: Fury Road', 'John Wick', 'The Bourne Identity', 'Casino Royale', 'Heat'],
      tvShows: ['Breaking Bad', 'Better Call Saul', 'Ozark', 'The Mandalorian', 'Jack Ryan']
    },
    ISFP: {
      films: ['The Secret Life of Walter Mitty', 'Amélie', 'Lost in Translation', 'Eternal Sunshine', 'Her'],
      tvShows: ['Anne with an E', 'Gilmore Girls', 'This Is Us', 'The Good Place', 'Atypical']
    },
    ESTP: {
      films: ['Fast & Furious', 'Mission: Impossible', 'Top Gun', 'Die Hard', 'Mad Max: Fury Road'],
      tvShows: ['The Bachelor', 'Survivor', 'Jack Ryan', 'The Mandalorian', 'Ozark']
    },
    ESFP: {
      films: ['La La Land', 'The Greatest Showman', 'Mamma Mia!', 'Pitch Perfect', 'The Devil Wears Prada'],
      tvShows: ['Friends', 'How I Met Your Mother', 'New Girl', 'Brooklyn Nine-Nine', 'The Office']
    }
  };

  const recs = recommendations[mbtiType] || {
    films: ['The Shawshank Redemption', 'Inception', 'The Dark Knight', 'Pulp Fiction', 'Forrest Gump'],
    tvShows: ['Breaking Bad', 'The Office', 'Friends', 'Game of Thrones', 'Stranger Things']
  };

  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🎬</span>
        Recommended Films & TV Shows
      </h3>
      <div className={styles.cardContent}>
        <div className={styles.mediaDisplay}>
          <div className={styles.mediaSection}>
            <h4 className={styles.mediaSectionTitle}>🎬 Films</h4>
            <ul className={styles.mediaList}>
              {recs.films.map((film, index) => (
                <li key={index} className={styles.mediaItem}>{film}</li>
              ))}
            </ul>
          </div>
          <div className={styles.mediaSection}>
            <h4 className={styles.mediaSectionTitle}>📺 TV Shows</h4>
            <ul className={styles.mediaList}>
              {recs.tvShows.map((show, index) => (
                <li key={index} className={styles.mediaItem}>{show}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LuckyColorCard({ mbtiType }: { mbtiType: string }) {
  // Generate random colors each time

  // Pantone color database with hex codes and Pantone numbers
  const pantoneColors = [
    { hex: '#1a1a1a', pantone: 'PANTONE Black C', name: 'Black' },
    { hex: '#2c3e50', pantone: 'PANTONE 533 C', name: 'Navy Blue' },
    { hex: '#34495e', pantone: 'PANTONE 7547 C', name: 'Dark Gray' },
    { hex: '#8e44ad', pantone: 'PANTONE 2685 C', name: 'Purple' },
    { hex: '#9b59b6', pantone: 'PANTONE 7447 C', name: 'Lavender' },
    { hex: '#2980b9', pantone: 'PANTONE 3005 C', name: 'Blue' },
    { hex: '#3498db', pantone: 'PANTONE 2925 C', name: 'Sky Blue' },
    { hex: '#16a085', pantone: 'PANTONE 569 C', name: 'Teal' },
    { hex: '#27ae60', pantone: 'PANTONE 348 C', name: 'Green' },
    { hex: '#2ecc71', pantone: 'PANTONE 356 C', name: 'Emerald' },
    { hex: '#f39c12', pantone: 'PANTONE 137 C', name: 'Orange' },
    { hex: '#e67e22', pantone: 'PANTONE 1665 C', name: 'Carrot Orange' },
    { hex: '#e74c3c', pantone: 'PANTONE 199 C', name: 'Red' },
    { hex: '#c0392b', pantone: 'PANTONE 200 C', name: 'Crimson' },
    { hex: '#e91e63', pantone: 'PANTONE 213 C', name: 'Pink' },
    { hex: '#ad1457', pantone: 'PANTONE 7437 C', name: 'Rose' },
    { hex: '#795548', pantone: 'PANTONE 476 C', name: 'Brown' },
    { hex: '#607d8b', pantone: 'PANTONE 7545 C', name: 'Blue Gray' },
    { hex: '#455a64', pantone: 'PANTONE 7546 C', name: 'Charcoal' },
    { hex: '#263238', pantone: 'PANTONE 426 C', name: 'Dark Blue Gray' },
    { hex: '#ff5722', pantone: 'PANTONE 1655 C', name: 'Deep Orange' },
    { hex: '#ff9800', pantone: 'PANTONE 1505 C', name: 'Amber' },
    { hex: '#ffc107', pantone: 'PANTONE 116 C', name: 'Yellow' },
    { hex: '#ffeb3b', pantone: 'PANTONE 102 C', name: 'Bright Yellow' },
    { hex: '#cddc39', pantone: 'PANTONE 380 C', name: 'Lime' },
    { hex: '#8bc34a', pantone: 'PANTONE 376 C', name: 'Light Green' },
    { hex: '#4caf50', pantone: 'PANTONE 348 C', name: 'Green' },
    { hex: '#009688', pantone: 'PANTONE 3282 C', name: 'Teal' },
    { hex: '#00bcd4', pantone: 'PANTONE 319 C', name: 'Cyan' },
    { hex: '#03a9f4', pantone: 'PANTONE 2985 C', name: 'Light Blue' },
    { hex: '#2196f3', pantone: 'PANTONE 300 C', name: 'Blue' },
    { hex: '#3f51b5', pantone: 'PANTONE 2736 C', name: 'Indigo' },
    { hex: '#673ab7', pantone: 'PANTONE 2685 C', name: 'Deep Purple' },
    { hex: '#9c27b0', pantone: 'PANTONE 2617 C', name: 'Purple' },
    { hex: '#f44336', pantone: 'PANTONE 199 C', name: 'Red' }
  ];

  const generateColorMeaning = (color: { name: string; pantone: string }) => {
    const meanings = [
      `${color.name} reflects your unique energy today. This ${color.pantone} shade enhances your ${mbtiType.includes('E') ? 'extroverted' : 'introverted'} nature and brings balance to your personality.`,
      `Your lucky color today is ${color.name} (${color.pantone}). This vibrant hue aligns with your ${mbtiType.includes('T') ? 'logical' : 'emotional'} approach and supports your ${mbtiType.includes('J') ? 'structured' : 'flexible'} lifestyle.`,
      `The ${color.name} color resonates with your ${mbtiType} personality today. This ${color.pantone} shade reflects your current spiritual and emotional state, bringing harmony to your decisions.`,
      `${color.name} (${color.pantone}) enhances your natural charisma today. This color supports your personal growth and mirrors your personality's depth and complexity.`,
      `Today's lucky color, ${color.name}, brings positive energy to your ${mbtiType} nature. The ${color.pantone} shade aligns with your current mindset and enhances your natural strengths.`
    ];
    return meanings[Math.floor(Math.random() * meanings.length)];
  };

  const selectedColor = pantoneColors[Math.floor(Math.random() * pantoneColors.length)];
  const colorMeaning = generateColorMeaning(selectedColor);

  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🌈</span>
        Your Lucky Colors
      </h3>
      <div className={styles.cardContent}>
        <div className={styles.colorDisplay}>
          <div className={styles.colorSwatches}>
            <div 
              className={styles.colorSwatch}
              style={{ backgroundColor: selectedColor.hex }}
            >
              <div className={styles.colorLabel}>{selectedColor.pantone}</div>
            </div>
          </div>
          <div className={styles.colorMeaning}>
            <p>{colorMeaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CitiesCard({ cities }: { cities: string[] }) {
  // Extract the first city name (before the dash) for display
  const topCity = cities[0].split(' - ')[0];
  const topCityReason = cities[0].split(' - ')[1];
  
  const coords = cityCoordinates[topCity] || { lat: 40.7128, lon: -74.0060 };
  
  return (
    <div className={styles.resultCard}>
      <h3>
        <span className={styles.cardIcon}>🌆</span>
        Best Cities to Live
      </h3>
      <div className={styles.cardContent}>
        <ol className={styles.numberedList}>
          {cities.map((city, i) => (
            <li key={i}>{city}</li>
          ))}
        </ol>
        <div className={styles.cityShowcase}>
          <div className={styles.cityMapContainer}>
            <iframe
              className={styles.cityMapIframe}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon-0.1},${coords.lat-0.05},${coords.lon+0.1},${coords.lat+0.05}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
              style={{ border: 0 }}
            />
            <div className={styles.cityOverlay}>
              <h4 className={styles.topCityName}>{topCity}</h4>
              <p className={styles.topCityReason}>{topCityReason}</p>
            </div>
          </div>
          <div className={styles.cityImageCaption}>
            #1 Recommended City
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedTrackCard({ track, mbtiType }: { track: SpotifyTrack; mbtiType: string }) {
  return (
    <div className={styles.featuredTrack}>
      <div className={styles.featuredTrackContent}>
        <div className={styles.featuredImage}>
          {track.album.images[0] && (
            <img src={track.album.images[0].url} alt={track.album.name} />
          )}
          <div className={styles.imageOverlay}>
            <div className={styles.mbtiTypeBadge}>{mbtiType}</div>
          </div>
        </div>
        <div className={styles.featuredInfo}>
          <div className={styles.featuredHeader}>
            <h3 className={styles.featuredTrackName}>{track.name}</h3>
            <p className={styles.featuredArtist}>
              {track.artists.map(artist => artist.name).join(', ')}
            </p>
            <p className={styles.albumName}>{track.album.name}</p>
          </div>
          <div className={styles.featuredActions}>
            {track.preview_url && (
              <div className={styles.audioSection}>
                <label className={styles.audioLabel}>🎧 30-Second Preview</label>
                <audio controls className={styles.featuredAudioPlayer}>
                  <source src={track.preview_url} type="audio/mpeg" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}
            <a 
              href={track.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.featuredSpotifyLink}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const mbtiContent: {
  cities: { [key: string]: string[] };
  horoscope: { [key: string]: string };
  hobbies: { [key: string]: string[] };
  learning: { [key: string]: string };
  communication: { [key: string]: string };
  strengths: { [key: string]: string[] };
  growth: { [key: string]: string[] };
  environment: { [key: string]: string };
  careers: { [key: string]: string[] };
  motivation: { [key: string]: string };
} = {
  cities: {
    INTJ: ["Boston, MA - Intellectual hub with top universities", "Seattle, WA - Tech innovation center", "Berlin, Germany - Progressive and efficient", "Tokyo, Japan - Advanced systems and order", "Austin, TX - Growing tech scene"],
    INTP: ["San Francisco, CA - Tech and ideas capital", "Cambridge, MA - Academic excellence", "Portland, OR - Quirky and innovative", "Amsterdam, Netherlands - Liberal thinking", "Stockholm, Sweden - Design and innovation"],
    ENTJ: ["New York, NY - Business and power center", "Singapore - Efficient and ambitious", "London, UK - Global finance hub", "Hong Kong - Fast-paced business", "Chicago, IL - Corporate headquarters"],
    ENTP: ["San Francisco, CA - Innovation and startups", "Tel Aviv, Israel - Startup nation", "Berlin, Germany - Creative entrepreneurship", "Austin, TX - Music and tech fusion", "Barcelona, Spain - Creative energy"],
    INFJ: ["Santa Fe, NM - Artistic and spiritual", "Portland, OR - Values-driven community", "Kyoto, Japan - Tradition and meaning", "Edinburgh, Scotland - History and culture", "Boulder, CO - Mindful living"],
    INFP: ["Asheville, NC - Arts and nature", "Portland, OR - Creative and authentic", "Reykjavik, Iceland - Nature and peace", "Santa Cruz, CA - Beach and values", "Prague, Czech Republic - Romantic beauty"],
    ENFJ: ["Washington, DC - Making an impact", "Geneva, Switzerland - International cooperation", "Copenhagen, Denmark - Social harmony", "Vancouver, Canada - Community focus", "Dublin, Ireland - Friendly and social"],
    ENFP: ["Barcelona, Spain - Vibrant and creative", "Melbourne, Australia - Arts and culture", "Montreal, Canada - Festival city", "Amsterdam, Netherlands - Free-spirited", "Austin, TX - Keep it weird"],
    ISTJ: ["Minneapolis, MN - Clean and organized", "Zurich, Switzerland - Order and stability", "Munich, Germany - Traditional efficiency", "Tokyo, Japan - Punctual systems", "Charlotte, NC - Banking stability"],
    ISFJ: ["Madison, WI - Family-friendly", "Copenhagen, Denmark - Safe and caring", "Portland, ME - Community-oriented", "Vienna, Austria - Traditional values", "Nashville, TN - Southern hospitality"],
    ESTJ: ["Dallas, TX - Business-minded", "Frankfurt, Germany - Financial center", "Singapore - Efficiency and order", "Houston, TX - Corporate growth", "Atlanta, GA - Business hub"],
    ESFJ: ["Nashville, TN - Warm community", "Salt Lake City, UT - Family values", "San Diego, CA - Friendly weather", "Dublin, Ireland - Social culture", "Charleston, SC - Southern charm"],
    ISTP: ["Denver, CO - Outdoor adventure", "Auckland, New Zealand - Action sports", "Portland, OR - DIY culture", "Munich, Germany - Engineering", "Phoenix, AZ - Desert activities"],
    ISFP: ["Santa Fe, NM - Art colony", "Florence, Italy - Renaissance beauty", "Byron Bay, Australia - Beach art", "Sedona, AZ - Natural beauty", "Savannah, GA - Historic charm"],
    ESTP: ["Las Vegas, NV - Excitement and action", "Miami, FL - Fast-paced energy", "Dubai, UAE - Luxury and deals", "Los Angeles, CA - Entertainment", "Sydney, Australia - Beach action"],
    ESFP: ["New Orleans, LA - Party and music", "Rio de Janeiro, Brazil - Carnival spirit", "Ibiza, Spain - Social scene", "Miami, FL - Beaches and fun", "Las Vegas, NV - Entertainment hub"]
  },
  careers: {
    INTJ: ["Strategic Planner", "Software Architect", "Data Scientist", "Research Scientist", "Systems Engineer"],
    INTP: ["Theoretical Physicist", "Software Developer", "Mathematician", "Philosopher", "Technical Writer"],
    ENTJ: ["CEO", "Management Consultant", "Corporate Lawyer", "Investment Banker", "Operations Director"],
    ENTP: ["Entrepreneur", "Marketing Director", "Innovation Consultant", "Venture Capitalist", "Debater"],
    INFJ: ["Counselor", "Psychologist", "Writer", "HR Director", "Social Advocate"],
    INFP: ["Creative Writer", "Therapist", "Graphic Designer", "Social Worker", "Artist"],
    ENFJ: ["Teacher", "Public Relations Manager", "Life Coach", "Event Coordinator", "Motivational Speaker"],
    ENFP: ["Creative Director", "Journalist", "Actor", "Campaign Manager", "Brand Strategist"],
    ISTJ: ["Accountant", "Project Manager", "Quality Assurance", "Compliance Officer", "Logistics Coordinator"],
    ISFJ: ["Nurse", "Librarian", "Administrative Manager", "Customer Service Manager", "Interior Designer"],
    ESTJ: ["Business Manager", "Judge", "Military Officer", "Financial Officer", "Construction Manager"],
    ESFJ: ["Event Planner", "Sales Manager", "Restaurant Manager", "Teacher", "Healthcare Administrator"],
    ISTP: ["Mechanical Engineer", "Pilot", "Detective", "Software Tester", "Athletic Trainer"],
    ISFP: ["Chef", "Photographer", "Massage Therapist", "Veterinarian", "Fashion Designer"],
    ESTP: ["Sales Executive", "Paramedic", "Real Estate Agent", "Sports Coach", "Stock Broker"],
    ESFP: ["Entertainer", "Tour Guide", "Flight Attendant", "Personal Trainer", "Event Host"]
  },
  hobbies: {
    INTJ: ["Strategic board games (Chess, Go)", "Reading philosophy & science", "Programming personal projects", "Learning new languages", "Studying complex systems"],
    INTP: ["Puzzle solving", "Building theoretical models", "Video game design", "Scientific experiments", "Coding for fun"],
    ENTJ: ["Leadership training", "Competitive sports", "Investment portfolio management", "Public speaking", "Strategic planning games"],
    ENTP: ["Debating clubs", "Entrepreneurial ventures", "Improvisation", "Travel & exploration", "Learning new skills rapidly"],
    INFJ: ["Journaling & reflection", "Meditation & yoga", "Volunteering", "Creative writing", "Deep conversations"],
    INFP: ["Poetry writing", "Sketching & painting", "Playing musical instruments", "Fantasy world-building", "Nature photography"],
    ENFJ: ["Community organizing", "Mentoring others", "Group fitness classes", "Drama & theater", "Hosting gatherings"],
    ENFP: ["Brainstorming sessions", "Traveling to new places", "Attending workshops", "Creative crafts", "Social activism"],
    ISTJ: ["Organizing collections", "Historical research", "Home improvement", "Traditional crafts", "Systematic cooking"],
    ISFJ: ["Scrapbooking", "Gardening", "Baking", "Caring for pets", "Family genealogy"],
    ESTJ: ["Managing community projects", "Team sports", "DIY projects", "Competitive gaming", "Efficient workflow optimization"],
    ESFJ: ["Party planning", "Cooking for others", "Social clubs", "Decorating spaces", "Group activities"],
    ISTP: ["Hands-on building projects", "Extreme sports", "Car mechanics", "Woodworking", "Problem-solving games"],
    ISFP: ["Art & crafts", "Dance", "Playing instruments", "Animal care", "Exploring nature"],
    ESTP: ["Adventure sports", "Entrepreneurial side hustles", "Networking events", "Physical challenges", "Live entertainment"],
    ESFP: ["Performing arts", "Social dancing", "Fashion & styling", "Party organizing", "Sports participation"]
  },
  learning: {
    INTJ: "You thrive with <strong>strategic frameworks</strong> and theoretical models. Prefer self-paced learning with deep dives into complex subjects. You excel when you can see the big picture and connect concepts into comprehensive systems.",
    INTP: "You learn best through <strong>logical analysis</strong> and exploration. You need to understand the 'why' behind everything. Theoretical discussions and independent research fuel your learning process.",
    ENTJ: "You prefer <strong>structured, goal-oriented</strong> learning with clear outcomes. You excel in competitive environments and appreciate practical applications of knowledge that can be immediately implemented.",
    ENTP: "You thrive on <strong>intellectual debates</strong> and exploring multiple perspectives. You learn by questioning assumptions and connecting disparate ideas in innovative ways.",
    INFJ: "You learn through <strong>meaningful connections</strong> and personal relevance. You need to understand how knowledge impacts people and prefer deep, focused study sessions with time for reflection.",
    INFP: "You absorb information best when it aligns with your <strong>values and interests</strong>. Creative expression and personalized learning paths help you retain and apply knowledge effectively.",
    ENFJ: "You excel in <strong>collaborative learning</strong> environments. Group discussions, teaching others, and connecting learning to human impact enhance your understanding and retention.",
    ENFP: "You thrive with <strong>variety and inspiration</strong>. Interactive learning, creative projects, and the freedom to explore tangents keep you engaged and help you synthesize new ideas.",
    ISTJ: "You prefer <strong>systematic, step-by-step</strong> approaches with clear instructions. You value proven methods and appreciate detailed examples and practical applications.",
    ISFJ: "You learn best with <strong>structured guidance</strong> and hands-on practice. You benefit from clear expectations and appreciate learning through service and helping others.",
    ESTJ: "You thrive with <strong>organized, efficient</strong> learning methods. You prefer clear objectives, measurable progress, and practical applications that can be implemented immediately.",
    ESFJ: "You excel in <strong>collaborative settings</strong> with supportive instructors. You learn well through teaching others and appreciate structured programs with social components.",
    ISTP: "You learn by <strong>doing and experimenting</strong>. Hands-on practice, troubleshooting real problems, and learning at your own pace maximize your comprehension.",
    ISFP: "You absorb knowledge through <strong>direct experience</strong> and creative expression. You need freedom to explore and learn best when you can apply skills artistically.",
    ESTP: "You thrive with <strong>active, experiential</strong> learning. You need immediate application, real-world scenarios, and the freedom to learn through trial and error.",
    ESFP: "You excel with <strong>interactive, social</strong> learning experiences. Group activities, hands-on practice, and learning that's fun and engaging help you retain information."
  },
  communication: {
    INTJ: "Be direct and efficient. Focus on logic and strategy. Avoid small talk and get to the point. Respect your need for alone time to process ideas.",
    INTP: "Engage in intellectual discussions. Allow time for deep analysis. Don't rush decisions. Appreciate precision and accuracy in communication.",
    ENTJ: "Be confident and assertive. Present organized thoughts with clear goals. Value efficiency and results-oriented conversations. Stand firm on logical positions.",
    ENTP: "Embrace debate and diverse perspectives. Share innovative ideas freely. Don't take disagreements personally. Keep conversations intellectually stimulating.",
    INFJ: "Communicate authentically and deeply. Share meaningful insights. Listen actively and empathetically. Create safe spaces for vulnerable conversations.",
    INFP: "Express yourself through creative means. Honor your values in discussions. Take time to process emotions before responding. Seek harmony in communications.",
    ENFJ: "Be warm and supportive in interactions. Focus on people's needs and feelings. Lead with empathy. Create positive, encouraging dialogue.",
    ENFP: "Share your enthusiasm openly. Connect through storytelling. Explore possibilities together. Maintain authentic, energetic conversations.",
    ISTJ: "Be clear and factual. Follow through on commitments. Stick to proven methods. Communicate with precision and reliability.",
    ISFJ: "Show care through actions. Be considerate and supportive. Maintain harmony in interactions. Express appreciation regularly.",
    ESTJ: "Be direct and organized. State expectations clearly. Focus on facts and results. Lead with confidence and decisiveness.",
    ESFJ: "Foster warm, friendly connections. Show appreciation for others. Maintain group harmony. Communicate with care and consideration.",
    ISTP: "Keep it practical and concise. Focus on problem-solving. Give space for independent thinking. Communicate when there's a clear purpose.",
    ISFP: "Express through actions and creativity. Be gentle and authentic. Respect personal space. Show rather than tell when possible.",
    ESTP: "Be energetic and spontaneous. Focus on action and results. Keep conversations dynamic. Adapt quickly to changing situations.",
    ESFP: "Bring energy and positivity. Connect through shared experiences. Keep it fun and engaging. Show enthusiasm in your interactions."
  },
  strengths: {
    INTJ: ["Strategic thinking", "Independent problem-solving", "Long-term vision", "Analytical precision", "Decisive action"],
    INTP: ["Logical analysis", "Creative problem-solving", "Intellectual curiosity", "Pattern recognition", "Objective thinking"],
    ENTJ: ["Natural leadership", "Efficient execution", "Strategic planning", "Confident decision-making", "Organizational skills"],
    ENTP: ["Innovative thinking", "Adaptability", "Persuasive communication", "Quick learning", "Entrepreneurial spirit"],
    INFJ: ["Deep empathy", "Insightful intuition", "Visionary thinking", "Dedication to causes", "Understanding complexity"],
    INFP: ["Authentic values", "Creative expression", "Empathetic understanding", "Idealistic vision", "Adaptable approach"],
    ENFJ: ["Inspiring leadership", "Emotional intelligence", "People development", "Persuasive communication", "Organizational harmony"],
    ENFP: ["Creative enthusiasm", "People connection", "Adaptable thinking", "Inspirational ideas", "Authentic relationships"],
    ISTJ: ["Reliable consistency", "Detail orientation", "Practical efficiency", "Strong work ethic", "Organized systems"],
    ISFJ: ["Loyal dedication", "Careful attention", "Supportive nature", "Practical helping", "Strong memory"],
    ESTJ: ["Efficient management", "Clear structure", "Decisive action", "Practical solutions", "Strong leadership"],
    ESFJ: ["Social harmony", "Caring support", "Organized planning", "Team cooperation", "Practical service"],
    ISTP: ["Hands-on skills", "Calm problem-solving", "Adaptable approach", "Practical expertise", "Independent action"],
    ISFP: ["Artistic creativity", "Present awareness", "Gentle compassion", "Aesthetic sense", "Flexible adaptation"],
    ESTP: ["Quick action", "Practical solutions", "Energetic approach", "Risk-taking courage", "Resourceful thinking"],
    ESFP: ["Spontaneous energy", "Social connection", "Practical help", "Enthusiastic presence", "Adaptable spirit"]
  },
  growth: {
    INTJ: ["Practice emotional expression", "Be more patient with others' processes", "Appreciate small details", "Develop social spontaneity", "Consider feelings alongside logic"],
    INTP: ["Follow through on practical tasks", "Express emotions more openly", "Consider social dynamics", "Finish started projects", "Engage with the present moment"],
    ENTJ: ["Listen more, talk less", "Show empathy in decisions", "Appreciate others' feelings", "Slow down and reflect", "Value process over just results"],
    ENTP: ["Complete started projects", "Focus on practical implementation", "Be more sensitive to feelings", "Follow through consistently", "Maintain organized systems"],
    INFJ: ["Set healthy boundaries", "Express needs directly", "Accept imperfections", "Balance idealism with realism", "Take action without overthinking"],
    INFP: ["Make decisions more quickly", "Handle criticism constructively", "Focus on practical details", "Assert yourself confidently", "Follow through on commitments"],
    ENFJ: ["Prioritize your own needs", "Accept that not everyone wants help", "Set clear boundaries", "Handle conflict directly", "Avoid over-extending yourself"],
    ENFP: ["Follow through on commitments", "Organize your environment", "Focus on one thing at a time", "Handle mundane tasks", "Make decisions more quickly"],
    ISTJ: ["Embrace spontaneity", "Consider new perspectives", "Express feelings more openly", "Adapt to unexpected changes", "Appreciate abstract thinking"],
    ISFJ: ["Assert your own needs", "Embrace necessary change", "Handle conflict directly", "Say no when needed", "Take credit for achievements"],
    ESTJ: ["Consider others' emotions", "Be flexible with plans", "Listen to different viewpoints", "Show vulnerability", "Value process over efficiency"],
    ESFJ: ["Handle criticism less personally", "Assert your boundaries", "Accept conflict as natural", "Focus on your own needs", "Embrace independent thinking"],
    ISTP: ["Express emotions verbally", "Plan for the future", "Consider others' feelings", "Engage in long-term commitments", "Develop social connections"],
    ISFP: ["Address conflict directly", "Plan ahead more", "Make decisions quickly", "Assert your opinions", "Focus on long-term goals"],
    ESTP: ["Think before acting", "Consider long-term consequences", "Develop emotional awareness", "Plan and organize", "Practice patience and reflection"],
    ESFP: ["Plan for the future", "Handle criticism constructively", "Focus deeply on tasks", "Develop long-term discipline", "Embrace solitude for reflection"]
  },
  motivation: {
    INTJ: "\"The mind is not a vessel to be filled, but a fire to be kindled.\" - Your strategic vision shapes the future.",
    INTP: "\"Logic will get you from A to B. Imagination will take you everywhere.\" - Your analytical mind unlocks possibilities.",
    ENTJ: "\"The best way to predict the future is to create it.\" - Your leadership drives transformation.",
    ENTP: "\"Innovation distinguishes between a leader and a follower.\" - Your creativity challenges the status quo.",
    INFJ: "\"Be the change you wish to see in the world.\" - Your insight inspires authentic transformation.",
    INFP: "\"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.\" - Your authenticity is your power.",
    ENFJ: "\"The greatest glory in living lies not in never falling, but in rising every time we fall.\" - Your empathy lifts others up.",
    ENFP: "\"Life is either a daring adventure or nothing at all.\" - Your enthusiasm creates magical moments.",
    ISTJ: "\"Success is the sum of small efforts repeated day in and day out.\" - Your consistency builds empires.",
    ISFJ: "\"The best way to find yourself is to lose yourself in the service of others.\" - Your dedication makes a difference.",
    ESTJ: "\"Do what you can, with what you have, where you are.\" - Your execution turns plans into reality.",
    ESFJ: "\"Alone we can do so little; together we can do so much.\" - Your harmony creates strong communities.",
    ISTP: "\"Knowledge comes, but wisdom lingers.\" - Your practical skills solve real problems.",
    ISFP: "\"The purpose of art is washing the dust of daily life off our souls.\" - Your creativity brings beauty to the world.",
    ESTP: "\"Life is 10% what happens to you and 90% how you react to it.\" - Your adaptability conquers challenges.",
    ESFP: "\"Happiness is not something ready made. It comes from your own actions.\" - Your energy brightens every room."
  },
  horoscope: {
    INTJ: "<strong>This week:</strong> The stars align for your strategic planning. A breakthrough insight arrives mid-week. <strong>Focus:</strong> Trust your intuition alongside your logic. <strong>Lucky element:</strong> Deep conversations will unlock new pathways. Your analytical powers are at their peak—use them to solve that complex problem you've been pondering.",
    INTP: "<strong>This week:</strong> Mercury enhances your already brilliant mind. Intellectual discoveries await in unexpected places. <strong>Focus:</strong> Connect your theories to practical applications. <strong>Lucky element:</strong> A random curiosity leads to profound understanding. Share your ideas—others need your unique perspective.",
    ENTJ: "<strong>This week:</strong> Leadership opportunities multiply. Your commanding presence attracts important connections. <strong>Focus:</strong> Balance ambition with collaboration. <strong>Lucky element:</strong> A bold move pays dividends. The universe rewards your decisiveness—don't second-guess your strategic instincts this week.",
    ENTP: "<strong>This week:</strong> Innovation flows through you like electricity. Your creative ideas challenge conventions brilliantly. <strong>Focus:</strong> Choose one project to complete. <strong>Lucky element:</strong> Debate sparks breakthrough moments. Your adaptability turns a potential obstacle into an opportunity for reinvention.",
    INFJ: "<strong>This week:</strong> Your intuition is extraordinarily heightened. Deep insights about people and situations emerge clearly. <strong>Focus:</strong> Set boundaries to protect your energy. <strong>Lucky element:</strong> A meaningful connection transforms your perspective. Trust the vision you're receiving—it's guiding you toward your purpose.",
    INFP: "<strong>This week:</strong> Creative energy flows abundantly. Your authentic self shines through in beautiful ways. <strong>Focus:</strong> Turn dreams into tangible steps. <strong>Lucky element:</strong> Art or writing brings unexpected clarity. The universe is asking you to share your unique gifts—don't hide your light.",
    ENFJ: "<strong>This week:</strong> Your natural charisma draws people to you. Opportunities to inspire and lead multiply. <strong>Focus:</strong> Remember to nurture yourself too. <strong>Lucky element:</strong> Mentoring creates mutual growth. Someone needs exactly what you have to offer—your empathy is healing more than you realize.",
    ENFP: "<strong>This week:</strong> Adventure and possibility surround you. New experiences open exciting doors. <strong>Focus:</strong> Follow through on one inspired idea. <strong>Lucky element:</strong> Spontaneity leads to magic. Your enthusiasm is contagious—watch how it transforms the energy of every room you enter.",
    ISTJ: "<strong>This week:</strong> Your methodical approach yields impressive results. Hard work gains recognition. <strong>Focus:</strong> Welcome one small change gracefully. <strong>Lucky element:</strong> Detailed planning prevents future chaos. Your reliability is building something lasting—stay the course with confidence.",
    ISFJ: "<strong>This week:</strong> Your caring nature creates ripple effects of kindness. Appreciation comes from unexpected sources. <strong>Focus:</strong> Accept help when offered. <strong>Lucky element:</strong> Quiet moments restore your soul. Your behind-the-scenes efforts are more valued than you know—let yourself receive gratitude.",
    ESTJ: "<strong>This week:</strong> Your organizational skills are in high demand. Projects move forward efficiently under your guidance. <strong>Focus:</strong> Listen to unconventional ideas. <strong>Lucky element:</strong> Structure creates freedom. Your ability to execute is turning vision into reality—others look to you for leadership.",
    ESFJ: "<strong>This week:</strong> Social connections bring joy and opportunity. Your warm presence strengthens relationships. <strong>Focus:</strong> Express your needs clearly. <strong>Lucky element:</strong> Community events spark happiness. Your gift for bringing people together is creating lasting bonds—celebrate your social genius.",
    ISTP: "<strong>This week:</strong> Hands-on problem-solving brings satisfaction. Technical challenges become enjoyable puzzles. <strong>Focus:</strong> Share your expertise with others. <strong>Lucky element:</strong> Solo time recharges your batteries. Your practical skills are needed—don't underestimate your ability to fix what others can't.",
    ISFP: "<strong>This week:</strong> Artistic inspiration flows naturally. Beauty surrounds and energizes you. <strong>Focus:</strong> Express emotions through creativity. <strong>Lucky element:</strong> Nature heals and inspires. Your aesthetic sensibility is a gift—let it guide your choices and creative expressions this week.",
    ESTP: "<strong>This week:</strong> Action and opportunity align perfectly. Quick thinking opens new doors. <strong>Focus:</strong> Consider long-term impacts. <strong>Lucky element:</strong> Physical activity clears mental fog. Your boldness is your superpower—trust your instincts to navigate dynamic situations.",
    ESFP: "<strong>This week:</strong> Joy and celebration find you everywhere. Your playful spirit attracts positive experiences. <strong>Focus:</strong> Balance fun with responsibilities. <strong>Lucky element:</strong> Performance or socializing energizes you. Your ability to live in the moment is teaching others how to truly enjoy life."
  },
  environment: {
    INTJ: "Quiet, organized spaces with minimal distractions. You need autonomy and time for deep thinking. Prefer competent colleagues and intellectually challenging work.",
    INTP: "Flexible environments that allow exploration. You thrive with intellectual freedom, minimal bureaucracy, and the ability to work independently on complex problems.",
    ENTJ: "Fast-paced, goal-oriented settings with clear hierarchies. You excel in challenging environments where you can lead, make decisions, and see measurable results.",
    ENTP: "Dynamic, innovative spaces with variety and intellectual stimulation. You need freedom to explore ideas and work with diverse, intelligent people.",
    INFJ: "Calm, meaningful environments aligned with your values. You thrive in settings that allow deep work, authentic connections, and making a positive impact.",
    INFP: "Creative, flexible spaces that honor your values. You need autonomy, creative freedom, and work that feels personally meaningful and authentic.",
    ENFJ: "Collaborative, people-centered environments. You excel in supportive settings where you can mentor others, build teams, and create positive change.",
    ENFP: "Energetic, creative spaces with variety and social interaction. You thrive when you have freedom to explore, connect with people, and pursue passions.",
    ISTJ: "Structured, stable environments with clear expectations. You prefer organized systems, defined processes, and workplaces that value reliability and precision.",
    ISFJ: "Harmonious, stable settings with supportive colleagues. You thrive in organized environments where you can help others and follow established procedures.",
    ESTJ: "Efficient, well-organized environments with clear goals. You excel in structured settings where you can take charge, implement systems, and drive results.",
    ESFJ: "Warm, social environments with team collaboration. You thrive in organized settings with friendly colleagues and opportunities to help others.",
    ISTP: "Hands-on, flexible environments with practical challenges. You need autonomy, room to troubleshoot, and the freedom to work independently.",
    ISFP: "Creative, peaceful spaces with aesthetic appeal. You thrive in flexible environments that allow personal expression and hands-on work.",
    ESTP: "Active, fast-paced environments with immediate challenges. You excel in dynamic settings that allow quick decision-making and hands-on problem-solving.",
    ESFP: "Energetic, social environments with variety and fun. You thrive in dynamic settings with people interaction and opportunities for spontaneity."
  }
};

export default function Home() {
  return <MBTIGenerator />;
}
