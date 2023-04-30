import './App.css';
import { Incident } from './components/home';
import Navbar from './components/navbar';
import { BrowserRouter } from 'react-router-dom';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

function App () {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Incident />
          {/* <Routes> */}
          {/* <Route path='/' element={<LoginPage />} /> */}
          {/* </Routes> */}
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
