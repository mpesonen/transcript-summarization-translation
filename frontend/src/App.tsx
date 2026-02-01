import { summarizeText } from './services/api'
import { TextField, Button, Select, MenuItem, Switch, FormGroup, FormControlLabel, Box, CircularProgress } from '@mui/material';
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [language, setLanguage] =  React.useState('English');
  const [translate, setTranslate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState(true);

  // Input text caching in LocalStorage (survives page reloads)
  const setInputToLocalStorage = (input: string) => {
    localStorage.setItem('userInput', input);
  };

  React.useEffect(() => {
    const savedInput = localStorage.getItem('userInput');
    if (savedInput) {
      const inputField = document.getElementById('inputField') as HTMLInputElement;
      inputField.value = savedInput;
    }
  }, []);

  const handleSubmit = async () => {
    const inputField = document.getElementById('inputField') as HTMLInputElement;
    const userInput = inputField.value;

    setLoading(true);
    try {
      setSummary(null);
      const summary = await summarizeText(userInput, translate ? language : null);
      setSummary(summary);
    } catch (error) {
      alert('Error summarizing text: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    const inputField = document.getElementById('inputField') as HTMLInputElement;
    inputField.value = '';
    setInputToLocalStorage('');
    setSummary(null);
  }

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.checked);
  }

  return (
    <>
      <ThemeProvider theme={theme ? darkTheme : lightTheme}>
        <CssBaseline />
        <h1>Transcript Summarizer & Translator</h1>

        <Box className="form-container">
          <Box className="controls-row">
            <FormGroup row>
              <FormControlLabel
                id="translate-checkbox"
                control={<Switch checked={translate} onChange={(e) => setTranslate(e.target.checked)} />}
                label="Translate"
              />
            </FormGroup>            
            <Select
              labelId="translate-select-label"
              id="translate-select"
              value={language}
              label="Target language"
              size="small"
              onChange={(e) => setLanguage(e.target.value as string)}
              disabled={!translate}
            >
              <MenuItem value={'English'}>🇬🇧 English</MenuItem>
              <MenuItem value={'Finnish'}>🇫🇮 Finnish</MenuItem>
              <MenuItem value={'Swedish'}>🇸🇪 Swedish</MenuItem>
              <MenuItem value={'Spanish'}>🇪🇸 Spanish</MenuItem>
              <MenuItem value={'French'}>🇫🇷 French</MenuItem>
              <MenuItem value={'German'}>🇩🇪 German</MenuItem>
            </Select>
          </Box>

          <TextField
            id="inputField"
            label="Enter text to summarize or translate"
            variant="outlined"
            multiline
            rows={20}
            fullWidth
            onChange={(e) => setInputToLocalStorage(e.target.value as string)}
          />

          <Box className="submit-row">
            <Button variant="contained" color="secondary" onClick={handleClearInput} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Clear'}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
        </Box>

        {summary && (
          <TextField
            id="outputField"
            label="Summary"
            variant="outlined"
            multiline
            rows={8}
            fullWidth
            value={summary}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        )}

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={theme} onChange={handleThemeChange} />}
            label="Dark Mode"
          />
        </FormGroup>
      </ThemeProvider>
    </>
  )
}

export default App
