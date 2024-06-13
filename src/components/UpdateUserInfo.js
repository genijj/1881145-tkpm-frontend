import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UpdateUserInfo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/auth/get-user-info');
        const userInfo = response.data;
        setFormData({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          address: userInfo.address
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-user-info', formData);
      alert('User info updated successfully');
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                onChange={handleChange}
                value={formData.firstName}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.lastName}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                placeholder="Address"
                onChange={handleChange}
                value={formData.address}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
