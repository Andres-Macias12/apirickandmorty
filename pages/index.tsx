'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL = 'https://rickandmortyapi.com/api';

const Home = () => {
  const router = useRouter();
  const [seasons] = useState<number[]>([1, 2, 3, 4, 5]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [allCharacters, setAllCharacters] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const allCharactersList: any[] = [];
        let nextUrl = `${API_URL}/character`;

        while (nextUrl) {
          const response = await axios.get(nextUrl);
          allCharactersList.push(...response.data.results);
          nextUrl = response.data.info.next;
        }

        setAllCharacters(allCharactersList);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchAllCharacters();
  }, []);

  useEffect(() => {
    if (selectedSeason !== null) {
      const fetchEpisodes = async () => {
        try {
          const response = await axios.get(`${API_URL}/episode`, {
            params: {
              episode: `S${selectedSeason.toString().padStart(2, '0')}`,
            },
          });

          setEpisodes(response.data.results);
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      };

      fetchEpisodes();
    } else {
      setEpisodes([]);
    }
  }, [selectedSeason]);

  const handleSeasonClick = (season: number) => {
    setSelectedSeason(selectedSeason === season ? null : season);
  };

  const handleCharacterClick = (characterId: number) => {
    router.push(`/character/${characterId}`);
  };

  return (
    <div className="container">
      <h1>Rick y Morty - Navegación de Temporadas</h1>
      
      <nav className="season-nav">
        {seasons.map((season) => (
          <button 
            key={season} 
            className={`season-button ${selectedSeason === season ? 'active' : ''}`} 
            onClick={() => handleSeasonClick(season)}
          >
            Temporada {season}
          </button>
        ))}
      </nav>

      {selectedSeason !== null && (
        <div>
          <h2>Episodios de la Temporada {selectedSeason}</h2>
          <div className="episodes-list">
            {episodes.length > 0 ? (
              episodes.map((episode) => (
                <div key={episode.id} className="episode-card">
                  <h4>{episode.episode}: {episode.name}</h4>
                  <p>Fecha de emisión: {episode.air_date}</p>
                  {episode.image && (
                    <img src={episode.image} alt={episode.name} className="episode-image" />
                  )}
                </div>
              ))
            ) : (
              <p>No se encontraron episodios para esta temporada.</p>
            )}
          </div>
        </div>
      )}

      <h2>Todos los personajes de la serie</h2>
      <div className="all-characters-list">
        {allCharacters.map((character) => (
          <div 
            key={character.id} 
            className="character-card" 
            onClick={() => handleCharacterClick(character.id)}
          >
            <img src={character.image} alt={character.name} />
            <h4>{character.name}</h4>
            <p>{character.status} - {character.species}</p>
            <p>{character.gender} - Origen: {character.origin.name}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #20232a;
          color: #61dafb;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2.5rem;
        }
        .season-nav {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .season-button {
          background: #282c34;
          color: #61dafb;
          border: 2px solid #61dafb;
          padding: 10px 20px;
          font-size: 1.2rem;
          cursor: pointer;
          border-radius: 25px;
          transition: all 0.3s ease;
        }
        .season-button:hover {
          background: #61dafb;
          color: #282c34;
        }
        .season-button.active {
          background: #61dafb;
          color: #282c34;
          transform: scale(1.1);
        }
        .episodes-list, .all-characters-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .episode-card, .character-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: #f9f9f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .episode-card:hover, .character-card:hover {
          transform: scale(1.05);
        }
        .episode-image {
          max-width: 100%;
          border-radius: 8px;
          margin-top: 10px;
        }
        .character-card img {
          max-width: 100%;
          border-radius: 8px;
        }
        .character-card h4, .episode-card h4 {
          margin: 16px 0 8px;
        }
        .character-card p, .episode-card p {
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default Home;
