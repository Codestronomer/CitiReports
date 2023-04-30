import { useState } from 'react';

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
    <form className='AddIncidentForm' onSubmit={handleSubmit}>
      <h2>Report an Incident</h2>
      <label>
        Incident type:
        <input className='AddIncidentForm-input' type='text' value={incidentType} onChange={handleIncidentTypeChange} />
      </label>
      <br />
      <label>
        Description:
        <textarea className='AddIncidentForm-input' value={description} onChange={handleDescriptionChange} />
      </label>
      <br />
      <label>
        Location:
        <input className='AddIncidentForm-input' type='text' value={location} onChange={handleLocationChange} />
        {/* <button className='AddIncidentForm-locationBtn' type='button' onClick={handleLocationClick}>Get location</button> */}
      </label>
      <br />
      <button className='AddIncidentForm-submitBtn' type='submit'>Submit</button>
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
