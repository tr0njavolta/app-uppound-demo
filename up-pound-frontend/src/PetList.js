import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to navigate to pet detail page
  const navigateToPet = (petId) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    console.log('Fetching pets from API...');
    // Fetch pets from your backend API
    fetch('http://localhost:3002/api/pets')
      .then(response => {
        console.log('API Response status:', response.status);
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched pets:', data);
        setPets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pets:', error.message);
        setError(`Failed to load pets: ${error.message}`);
        setLoading(false);
        
        // Fallback to demo pets if the API fails
        setPets([
          { id: 1, name: 'Max', species: 'Dog', breed: 'Labrador', age: 3, description: 'Friendly and energetic lab who loves to play fetch', image_url: 'https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg' },
          { id: 2, name: 'Bella', species: 'Cat', breed: 'Siamese', age: 2, description: 'Sweet and talkative Siamese who loves attention', image_url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg' },
          { id: 3, name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 5, description: 'Loyal and protective shepherd, great with families', image_url: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_28271.jpg' }
        ]);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading pets...</div>;
  }

  return (
    <section className="pets-section">
      <h2 className="pets-heading">Available Pets</h2>
      {error && <div className="error">{error}</div>}
      {pets.length === 0 ? (
        <p>No pets found. Try adjusting your search criteria.</p>
      ) : (
        <div className="pets-grid">
          {pets.map((pet, index) => (
            <div key={pet.id} className="pet-card" onClick={() => navigateToPet(pet.id)}>
              <div className="pet-image-container">
                {pet.image_url ? (
                  <img 
                    src={pet.image_url} 
                    alt={pet.name} 
                    className="pet-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Pet+Image+Placeholder';
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f4f6f9',
                    color: '#9a9a9a'
                  }}>
                    Pet Image Placeholder
                  </div>
                )}
                <div className={`pet-status ${index % 2 === 0 ? 'teal' : 'gold'}`}>
                  Available
                </div>
              </div>
              <div className="pet-details">
                <h3 className="pet-name">{pet.name}</h3>
                <p className="pet-breed">
                  {pet.breed || 'Mixed Breed'} • {pet.age ? `${pet.age} years` : 'Age unknown'}
                </p>
                <div className="pet-meta">
                  <span className="pet-badge">{pet.species}</span>
                  <span className="pet-badge">Demo Pet</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card click handler from firing
                    navigateToPet(pet.id);
                  }}
                  className="view-profile-link"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PetList;
