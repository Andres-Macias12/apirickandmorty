import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://rickandmortyapi.com/api';

const CharacterPage = () => {
  const router = useRouter();
  const { id } = router.query;  // `id` es el parámetro de la URL
  const [character, setCharacter] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          const response = await axios.get(`${API_URL}/character/${id}`);
          setCharacter(response.data);
        } catch (error) {
          console.error('Error fetching character:', error);
        }
      };

      fetchCharacter();
    }
  }, [id]);

  if (!character) {
    return <p>Cargando información del personaje...</p>;
  }

  return (
    <div className="container">
      <h1>{character.name}</h1>
      <img src={character.image} alt={character.name} />
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <p>Gender: {character.gender}</p>
      <p>Origin: {character.origin.name}</p>
      <p>Location: {character.location.name}</p>
      
      <button onClick={() => router.back()} className="back-button">Regresar</button>

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
        img {
          max-width: 300px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2rem;
        }
        .back-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 1rem;
          color: #20232a;
          background-color: #61dafb;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .back-button:hover {
          background-color: #52b8e8;
        }
      `}</style>
    </div>
  );
};

export default CharacterPage;
