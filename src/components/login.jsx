import React, { useState } from 'react';

export const Login = () => {
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
    <form onSubmit={onSubmit}>
      <h1>Login Below!</h1>
      <input
        type='email'
        name='email'
        placeholder='Enter email'
        value={state.email}
        onChange={() => handleInputChange}
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Enter password'
        value={this.state.password}
        onChange={this.handleInputChange}
        required
      />
      <input type='submit' value='Submit' />
    </form>
  );
};
