import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pokemonId = searchParams.get('id');
    const pokemonName = searchParams.get('name');

    if (!pokemonId && !pokemonName) {
      return NextResponse.json(
        { error: 'Pokemon ID or name is required' },
        { status: 400 }
      );
    }

    const identifier = pokemonId || pokemonName;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    const pokemon = await response.json();
    
    // Get species information for additional details
    const speciesResponse = await fetch(pokemon.species.url);
    const species = speciesResponse.ok ? await speciesResponse.json() : null;

    // Format the response with relevant data
    const formattedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height / 10, // Convert to meters
      weight: pokemon.weight / 10, // Convert to kg
      types: pokemon.types.map((type: { type: { name: string } }) => type.type.name),
      abilities: pokemon.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
      stats: pokemon.stats.reduce((acc: Record<string, number>, stat: { stat: { name: string }; base_stat: number }) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
      }, {}),
      sprites: {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        other: {
          'official-artwork': pokemon.sprites.other?.['official-artwork']?.front_default
        }
      },
      description: species?.flavor_text_entries?.find((entry: { language: { name: string } }) => 
        entry.language.name === 'en'
      )?.flavor_text?.replace(/\f/g, ' ') || 'No description available'
    };

    return NextResponse.json(formattedPokemon);
  } catch (error: unknown) {
    console.error('Pokemon API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to fetch Pokemon data',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
