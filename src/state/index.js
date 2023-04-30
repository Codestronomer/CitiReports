import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  projects: []
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    // setProject: (state, action) => {
    // if (state.user) {
    // state.user.projects = action.payload.projects;
    // } else { console.error('Project non-existent :')},
    setIncidents: (state, action) => {
      state.incidents = action.payload.incidents;
    },
    setIncident: (state, action) => {
      const updatedIncidents = state.incidents.map((incident) => {
        if (incident._id === action.payload.incident_id) return action.payload.incident;
        return incident;
      });
      state.incidents = updatedIncidents;
    }
  }
});

export const { setMode, setLogin, setLogout, setProjects, setProject } = authSlice.actions;
export default authSlice.reducer;
