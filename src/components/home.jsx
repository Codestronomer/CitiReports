import { useState } from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Report } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export function Incident () {
  const [incidents, setIncidents] = useState([]);

  function handleAddIncident (newIncident) {
    setIncidents([...incidents, newIncident]);
  }

  return (
    <div>
      <AddIncidentForm onAddIncident={handleAddIncident} />
      <IncidentList incidents={incidents} />
    </div>
  );
}

export function AddIncidentForm (props) {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const theme = useTheme();

  const handleIncidentTypeChange = (event) => {
    setIncidentType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const incident = { type: incidentType, description: description, location: location };
    props.onAddIncident(incident);
    setIncidentType('');
    setDescription('');
    setLocation('');
  };

  return (
    <form className='AddIncidentForm'
      onSubmit={handleSubmit}
      style={{background: theme.palette.background.alt}}
    >
      <div className='incidentText'>
        <h2>Report an Incident</h2>
        <IconButton>
          <Report />
        </IconButton>
      </div>
      <div className='formInput'>
        <label>
          Incident type
        </label>
        <input type='text' value={incidentType} onChange={handleIncidentTypeChange} />
      </div>
      <div className='formInput'>
        <label>
          Description
        </label>
        <textarea value={description} onChange={handleDescriptionChange} />
      </div>
      <div className='formInput'>
        <label>
          Location
          {/* <button className='AddIncidentForm-locationBtn' type='button' onClick={handleLocationClick}>Get location</button> */}
        </label>
        <input type='text' value={location} onChange={handleLocationChange} />
      </div>
      <Button sx={{color: theme.palette.background.alt,
                                                        background: theme.palette.primary.main,
                                                        fontWeight: 700,
                                                        fontSize: '15px'}} 
                                                    type='submit'>Submit</Button>
    </form>
  );
}

function IncidentList (props) {
  const incidents = props.incidents.map(incident => (
    <div className='report' key={incident.id}>
      <h3>{incident.type}</h3>
      <p>{incident.description}</p>
      <p>{incident.location}</p>
    </div>
  ));

  return (
    <div className='IncidentList'>
      {incidents}
    </div>
  );
}
