import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditAlbum = ({ album, onUpdate }) => {
  const [name, setName] = useState(album.name);
  const [artistId, setArtistId] = useState(album.artist_id);
  const [releaseYear, setReleaseYear] = useState(album.release_year);
  const [numberOfListens, setNumberOfListens] = useState(album.number_of_listens);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/albums/${album.id}`, { 
        name,
        artist_id: artistId,
        release_year: releaseYear,
        number_of_listens: numberOfListens,
      });
      console.log('Album updated:', response.data);
      onUpdate(response.data); // Notify parent component
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Album Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Release Year"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Listens"
        value={numberOfListens}
        onChange={(e) => setNumberOfListens(e.target.value)}
      />
      <button type="submit">Update Album</button>
    </form>
  );
};

export default EditAlbum;