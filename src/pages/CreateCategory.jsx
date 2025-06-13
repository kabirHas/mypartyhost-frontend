import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const iconOptions = [
  { id: 'ri-book-2-line', label: 'Book' },
  { id: 'ri-paint-line', label: 'Paint' },
  { id: 'ri-music-line', label: 'Music' },
  { id: 'ri-gamepad-line', label: 'Gamepad' },
  { id: 'ri-rocket-line', label: 'Rocket' },
  { id: 'ri-settings-3-line', label: 'Settings' },
  { id: 'ri-lightbulb-line', label: 'Lightbulb' },
];

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(iconOptions[0].id);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/categories', { name, description, icon });
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Category</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <div>
        <p>Choose Icon:</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          {iconOptions.map(({ id, label }) => (
            <div
              key={id}
              onClick={() => setIcon(id)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                border: icon === id ? '2px solid blue' : '1px solid gray',
                borderRadius: '6px',
                textAlign: 'center',
                userSelect: 'none',
              }}
              title={label}
            >
              <i className={id} style={{ fontSize: '24px' }}></i>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" style={{ marginTop: '15px' }}>Create</button>
    </form>
  );
};

export default CreateCategory;
