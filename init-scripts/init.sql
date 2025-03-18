CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INT,
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS adoptions (
  id SERIAL PRIMARY KEY,
  pet_id INT REFERENCES pets(id),
  applicant_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample pets
INSERT INTO pets (name, species, breed, age, description, image_url)
VALUES 
  ('Max', 'Dog', 'Labrador', 3, 'Friendly and energetic lab who loves to play fetch', 'https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg'),
  ('Bella', 'Cat', 'Siamese', 2, 'Sweet and talkative Siamese who loves attention', 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'),
  ('Rocky', 'Dog', 'German Shepherd', 5, 'Loyal and protective shepherd, great with families', 'https://images.dog.ceo/breeds/germanshepherd/n02106662_28271.jpg');
