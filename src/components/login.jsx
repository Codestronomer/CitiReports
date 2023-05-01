import React, { useState } from 'react';
import { Button, Typography, useMediaQuery } from '@mui/material';
import FlexBetween from './flexBetween';
import { useTheme } from '@emotion/react';

export const Login = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [state, setState] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setState({
      [name]: value
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          // this.props.history.push('/');
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
            onChange={() => handleInputChange}
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
        </form>
    </FlexBetween>
  );
};
