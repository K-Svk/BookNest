import React, { useState } from 'react';
import './Onboarding.css';

const API_URL = 'http://localhost:5000/api';

export default function LoginPage({ onComplete }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (isRegistering && !name)) {
      return;
    }

    try {
      const endpoint = isRegistering
        ? `${API_URL}/auth/register`
        : `${API_URL}/auth/login`;

      const body = isRegistering
        ? {
            username: name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Something went wrong.');
        return;
      }

      const user = data.user;

      localStorage.setItem('booknestUser', JSON.stringify(user));

      if (data.token) {
        localStorage.setItem('booknestToken', data.token);
      }

      onComplete(user);

    } catch (error) {
      console.error('Authentication error:', error);
      alert('Unable to connect to BookNest server.');
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-paper">

        <div className="onboarding-brand">
          <span className="brand-mark">B</span>
          <span>BookNest</span>
        </div>

        <div className="onboarding-content">

          <p className="onboarding-eyebrow">
            YOUR READING SPACE
          </p>

          <h1>
            Every story
            <br />
            <em>starts somewhere.</em>
          </h1>

          <p className="onboarding-description">
            Keep track of the books you've loved,
            discover new favourites, and build a
            reading life that feels like yours.
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {isRegistering && (
              <label>
                <span>Your name</span>

                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}

            <label>
              <span>Email</span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              className="onboarding-primary-button"
              type="submit"
            >
              {isRegistering
                ? 'Create my BookNest'
                : 'Enter BookNest'}
            </button>

          </form>

          <button
            className="onboarding-switch"
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? 'Already have an account? Log in'
              : "New here? Create an account"}
          </button>

        </div>

        <div className="onboarding-decoration">
          <span>“</span>
        </div>

      </div>
    </div>
  );
}
