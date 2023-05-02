import { useState, useEffect } from 'react';
import { IncidentForm } from './incident';

export function Incident () {
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]);

  function handleAddIncident (newIncident) {
    setIncidents([...incidents, newIncident]);
  }

  useEffect(() => {
    fetch('http://localhost:4404/citireports/api/reports', {
      method: 'GET'
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        setReports(data);
      });
  }, [incidents]);

  return (
    <div>
      <IncidentForm onAddIncident={handleAddIncident} />
      <IncidentList incidents={reports} />
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
        return (<img className='reportName'
                  src={`http://localhost:4404/citireports/uploads/${image}`} 
                  key={image.id} 
                  alt="incident" />)
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
