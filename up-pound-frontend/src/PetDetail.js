import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching pet details for ID: ${id}`);
    // Fetch pet data from your backend API
    fetch(`http://localhost:3002/api/pets/${id}`)
      .then(response => {
        console.log('API Response status:', response.status);
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched pet details:', data);
        setPet(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pet details:', error.message);
        setError(`Failed to load pet details: ${error.message}`);
        setLoading(false);
        
        // Use fallback demo data for select IDs
        if (id === '1') {
          setPet({ 
            id: 1, 
            name: 'Max', 
            species: 'Dog', 
            breed: 'Labrador', 
            age: 3, 
            description: 'Friendly and energetic lab who loves to play fetch', 
            image_url: 'https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg' 
          });
          setLoading(false);
          setError(null);
        } else if (id === '2') {
          setPet({ 
            id: 2, 
            name: 'Bella', 
            species: 'Cat', 
            breed: 'Siamese', 
            age: 2, 
            description: 'Sweet and talkative Siamese who loves attention', 
            image_url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg' 
          });
          setLoading(false);
          setError(null);
        } else if (id === '3') {
          setPet({ 
            id: 3, 
            name: 'Rocky', 
            species: 'Dog', 
            breed: 'German Shepherd', 
            age: 5, 
            description: 'Loyal and protective shepherd, great with families', 
            image_url: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_28271.jpg' 
          });
          setLoading(false);
          setError(null);
        }
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading pet details...</div>;
  }

  if (error && !pet) {
    return (
      <div>
        <div className="error">{error}</div>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            color: '#9a5efc', 
            marginTop: '20px', 
            textDecoration: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '16px'
          }}
        >
          ← Back to all pets
        </button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div>
        <div className="error">Pet not found</div>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            color: '#9a5efc', 
            marginTop: '20px', 
            textDecoration: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '16px'
          }}
        >
          ← Back to all pets
        </button>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/')}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#9a5efc', 
          marginBottom: '20px', 
          textDecoration: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontSize: '16px'
        }}
      >
        ← Back to all pets
      </button>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Pet Header */}
        <div style={{ 
          position: 'relative',
          height: '300px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          {pet.image_url ? (
            <img 
              src={pet.image_url} 
              alt={pet.name} 
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x500?text=Pet+Image+Placeholder';
              }}
            />
          ) : (
            <div style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              Pet Image Placeholder
            </div>
          )}
          
          {/* Gradient overlay */}
          <div style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            zIndex: 1
          }}></div>
          
          {/* Pet name and details */}
          <div style={{ 
            position: 'relative',
            zIndex: 2,
            padding: '30px',
            width: '100%'
          }}>
            <span style={{ 
              backgroundColor: '#17e1cf',
              color: '#030724',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '10px',
              display: 'inline-block'
            }}>
              Available for Adoption
            </span>
            <h1 style={{ 
              color: 'white',
              margin: '10px 0 5px',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              {pet.name}
            </h1>
            <div style={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{pet.species}</span>
              <span>•</span>
              <span>{pet.breed || 'Mixed Breed'}</span>
              <span>•</span>
              <span>{pet.age ? `${pet.age} years` : 'Age unknown'}</span>
            </div>
          </div>
        </div>
        
        {/* Pet Details */}
        <div style={{ padding: '30px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            marginTop: '0',
            marginBottom: '15px',
            color: '#030724'
          }}>
            About {pet.name}
          </h2>
          
          <p style={{ 
            lineHeight: '1.6',
            color: '#4b5563',
            marginBottom: '30px'
          }}>
            {pet.description || `Meet ${pet.name}, a lovely ${pet.breed || pet.species} looking for a forever home. ${pet.name} is ${pet.age ? `${pet.age} years old` : 'waiting for you'} and would make a perfect companion for your family.`}
          </p>
          
          {/* Adoption CTA */}
          <div style={{ 
            backgroundColor: '#f4f6f9',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              marginTop: '0',
              marginBottom: '10px',
              color: '#030724'
            }}>
              Interested in adopting {pet.name}?
            </h3>
            <p style={{ 
              marginBottom: '15px',
              color: '#4b5563'
            }}>
              Start the adoption process now to meet {pet.name} and potentially welcome them into your home.
            </p>
            <button
              onClick={() => navigate(`/adopt/${pet.id}`)}
              style={{ 
                display: 'inline-block',
                backgroundColor: '#9a5efc',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                textDecoration: 'none',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Start Adoption Process
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#9a5efc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            marginRight: '10px'
          }}>
            i
          </div>
          <h3 style={{
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#030724'
          }}>
            Upbound Demo Note
          </h3>
        </div>
        <p style={{
          margin: '0',
          color: '#4b5563',
          fontSize: '14px'
        }}>
          This pet profile is part of the Up-Pound demo application, showcasing how Upbound Crossplane
          manages cloud resources for microservices. The pet data is stored in an RDS PostgreSQL instance
          provisioned and managed by Crossplane.
        </p>
      </div>
    </div>
  );
}

export default PetDetail;
