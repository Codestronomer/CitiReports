import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, IconButton } from '@mui/material';
import { Input } from '@mui/base';
import FlexBetween from './flexBetween';
import { useTheme } from '@emotion/react';
import { Report } from '@mui/icons-material';

export const IncidentForm = (props) => {
  const theme = useTheme();
  const [state, setState] = useState({
    category: '',
    description: '',
    location: '',
    images: [],
  });
  const { onAddIncident } = props;

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    setState({
      ...state,
      category: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    setState({
      ...state,
      images: [...event.target.files],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddIncident(state);
    const formData = new FormData();
    formData.append('category', state.category);
    formData.append('description', state.description);
    formData.append('location', state.location);
    for (let i = 0; i < state.images.length; i++) {
      formData.append('images[]', state.images[i]);
    }

    fetch('/incidents', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          // success
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <FlexBetween sx={{}}>
      <form onSubmit={handleSubmit} className="incidentForm">
        <div className='incidentText'>
          <Typography sx={{ textAlign: 'center', fontWeight: 700 }} variant="h2">
            Report an Incident
          </Typography>
          <IconButton>
            <Report />
          </IconButton>
        </div>
        <FormControl variant="outlined" sx={{ margin: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '20px' }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={state.category}
            onChange={handleCategoryChange}
            label="Category"
            required
          >
            <MenuItem value="Road accident">Road accident</MenuItem>
            <MenuItem value="Workplace accident">Workplace accident</MenuItem>
            <MenuItem value="Sports accident">Sports accident</MenuItem>
            <MenuItem value="Recreational accident">Recreational accident</MenuItem>
            <MenuItem value="Medical accident">Medical accident</MenuItem>
            <MenuItem value="Construction accident">Construction accident</MenuItem>
            <MenuItem value="Aviation accident">Aviation accident</MenuItem>
            <MenuItem value="Natural disaster">Natural disaster</MenuItem>
          </Select>
          <TextField
            className="form-input"
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={state.description}
            onChange={handleInputChange}
            required
            sx={{ marginBottom: '20px'}}
          />
          <TextField
            className="form-input"
            id="location"
            name="location"
            label="Location"
            variant="outlined"
            value={state.location}
            onChange={handleInputChange}
            required
            sx={{ marginTop: '30px'}}
          />
          <Input
            type="file"
            accept="image/*"
            id="images"
            name="images"
            multiple
            onChange={handleImageChange}
            sx={{ margin: 'normal', width: '100%'}}
          />
        </FormControl>
        <Button sx={{color: theme.palette.background.alt,
                    background: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: '15px'}} 
                onClick={handleSubmit}>Submit</Button>
      </form>
    </FlexBetween>
  )
};
