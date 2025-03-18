import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    image_url: ''
  });
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = () => {
    fetch('http://localhost:3002/api/pets')
      .then(response => response.json())
      .then(data => {
        setPets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pets:', error);
        setLoading(false);
      });
  };

  const handleEdit = (pet) => {
    setEditingPet(pet.id);
    setFormData({
      name: pet.name,
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      description: pet.description || '',
      image_url: pet.image_url || ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploadStatus('Uploading...');
    
    fetch('http://localhost:3002/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to upload image');
      return response.json();
    })
    .then(data => {
      setFormData(prev => ({
        ...prev,
        image_url: `http://localhost:3002${data.imageUrl}`
      }));
      setUploadStatus('Upload successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      setUploadStatus('Upload failed');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const url = editingPet ? 
      `http://localhost:3002/api/pets/${editingPet}` : 
      'http://localhost:3002/api/pets';
    
    const method = editingPet ? 'PUT' : 'POST';
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to save pet');
      return response.json();
    })
    .then(data => {
      // No need to manually fetch pets again - WebSockets will update the list
      resetForm();
      setUploadStatus('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      fetch(`http://localhost:3002/api/pets/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete pet');
        return response.json();
      })
      .then(data => {
        // No need to manually fetch pets - WebSockets will update the list
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const resetForm = () => {
    setEditingPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      description: '',
      image_url: ''
    });
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-form">
        <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="species">Species</label>
            <select
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            >
              <option value="">Select Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Small Animal">Small Animal</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="breed">Breed</label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age (years)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="image-preview">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                  onError={(e) => {e.target.src = "https://placehold.co/200x150/e2e8f0/1e293b?text=No+Image+Available"}}
                />
              </div>
            )}
          </div>
          
          <div className="form-buttons">
            <button type="submit">{editingPet ? 'Update Pet' : 'Add Pet'}</button>
            {editingPet && (
              <button type="button" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>
      
      <div className="admin-pet-list">
        <h2>Manage Pets</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map(pet => (
              <tr key={pet.id}>
                <td>{pet.id}</td>
                <td>
                  <img 
                    src={pet.image_url || "https://placehold.co/100x75/e2e8f0/1e293b?text=No+Image"} 
                    alt={pet.name} 
                    style={{ width: '100px', height: '75px', objectFit: 'cover' }}
                    onError={(e) => {e.target.src = "https://placehold.co/100x75/e2e8f0/1e293b?text=No+Image"}}
                  />
                </td>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
                <td>
                  <button onClick={() => handleEdit(pet)}>Edit</button>
                  <button onClick={() => handleDelete(pet.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
