import { useState } from 'react';
import { IncidentForm } from './incident';

export function Incident () {
  const [incidents, setIncidents] = useState([]);

  function handleAddIncident (newIncident) {
    setIncidents([...incidents, newIncident]);
  }

  return (
    <div>
      <IncidentForm onAddIncident={handleAddIncident} />
      <IncidentList incidents={incidents} />
    </div>
  );
}

function IncidentList (props) {
  const incidents = props.incidents.map(incident => (
    <div className='report' key={incident.id}>
      <h3>{incident.category}</h3>
      <p>{incident.description}</p>
      <p>{incident.location}</p>
      {incident.images.map((image) => {
        <img src={image} alt="incident image" />
      })
      };
    </div>
  ));

  return (
    <div className='IncidentList'>
      {incidents}
    </div>
  );
}
