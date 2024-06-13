import React, { useState } from 'react';
import api from '../services/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', formData);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                className="form-control"
                placeholder="Old Password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                placeholder="New Password"
                onChange={handleChange}
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

export default ChangePassword;
