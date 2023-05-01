import React, { useState } from 'react';
import { Button, Typography, useMediaQuery } from '@mui/material';
import FlexBetween from './flexBetween';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state';

export const Login = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: '',
    password: ''
  });
  // const isNonMobile = useMediaQuery("(min-width: 600px)");

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:4404/citireports/login', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(setLogin({user: state}))
          navigate('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <FlexBetween sx={{}}>
        <form onSubmit={onSubmit} className="form">
          <Typography sx={{ textAlign: 'center', fontWeight: 700}}variant="h2">Login to CitiReports</Typography>
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
          <Button className="form-button" sx={{
                      maxWidth: '80px',
                      textAlign: 'center',
                      justifyContent:'center',
                      alignSelf: 'center',
                      color: palette.background.alt,
                      background: palette.primary.main,
                      fontWeight: 700,
                      fontSize: '15px'}} 
                      type='submit' value='Submit'
          >Login</Button>
          <Typography sx={{textAlign: 'center',
                          fontWeight: 700,
                          cursor: 'pointer'}} onClick={() => navigate('/signup')}>
            Don't have an account? Sign Up
        </Typography>
        </form>
    </FlexBetween>
  );
};
