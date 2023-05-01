import React, { useState } from 'react';
import { Button, Typography, useMediaQuery } from '@mui/material';
import FlexBetween from './flexBetween';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state';

export const Signup = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (state.password !== state.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    fetch('http://localhost:4404/citireports/signup', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          state.password = "";
          state.confirmPassword = "";
          dispatch(setLogin({user: state}));
          navigate("/");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        setError('Signup failed');
      });
  };

  return (
    <FlexBetween sx={{}}>
        <form onSubmit={onSubmit} className="form">
          <Typography sx={{ textAlign: 'center', fontWeight: 700}} variant="h2">Signup for CitiReports</Typography>
          {error && <div className="error">{error}</div>}
          <label>Username:</label>
          <input className='form-input'
                 type='text'
                 name='username'
                 placeholder='Enter username'
                 value={state.username}
                 onChange={handleInputChange}
                 required
                 />
          <label>Email Address:</label>
          <input className="form-input"
            type='email'
            name='email'
            placeholder='Enter email'
            value={state.email}
            onChange={handleInputChange}
            required
          />
          <label>Password:</label>
          <input className="form-input"
            type='password'
            name='password'
            placeholder='Enter password'
            value={state.password}
            onChange={handleInputChange}
            required
          />
          <label>Confirm Password:</label>
          <input className="form-input"
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            value={state.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <Button className="form-button" sx={{
                      maxWidth: '80px',
                      textAlign: 'center',
                      justifyContent:'center',
                      alignSelf: 'center',
                      color: palette.background.alt,
                      background: palette.primary.main,
                      fontWeight: 700,
                      fontSize: '15px'}} 
                      type='submit'
          >Signup</Button>
          <Typography sx={{textAlign: 'center',
                          fontWeight: 700,
                          cursor: 'pointer'}}
                       onClick={() => navigate('/login')}>
            Already have an account? Login
        </Typography>
        </form>
    </FlexBetween>
  );
};
