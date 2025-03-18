import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdoptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3002/api/pets/${id}`)
      .then(response => response.json())
      .then(data => {
        setPet(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pet details:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    fetch('http://localhost:3002/api/adoptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        petId: id,
        ...formData
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to submit application');
      return response.json();
    })
    .then(data => {
      setSubmitStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitStatus('error');
    });
  };

  if (loading) return <div>Loading adoption form...</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="form-container">
      <h1>Apply to Adopt {pet.name}</h1>
      {submitStatus === 'success' ? (
        <div className="success-message">
          <p>Your application has been submitted! We'll contact you soon.</p>
          <p>Redirecting to homepage...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicantName">Your Name</label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Why would you like to adopt {pet.name}?</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>
          
          <button type="submit" disabled={submitStatus === 'submitting'}>
            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
          </button>
          
          {submitStatus === 'error' && (
            <p className="error-message">There was an error submitting your application. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default AdoptionForm;
