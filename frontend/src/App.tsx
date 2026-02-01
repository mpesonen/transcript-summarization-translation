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

function App() {
  const [language, setLanguage] =  React.useState('English');
  const [translate, setTranslate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    const inputField = document.getElementById('inputField') as HTMLInputElement;
    const userInput = inputField.value;

    setLoading(true);
    try {
      const summary = await summarizeText(userInput, translate ? language : null);
      inputField.value = summary;
    } catch (error) {
      alert('Error summarizing text: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
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
              <MenuItem value={'English'}>English</MenuItem>
              <MenuItem value={'Finnish'}>Finnish</MenuItem>
              <MenuItem value={'Swedish'}>Swedish</MenuItem>
              <MenuItem value={'Spanish'}>Spanish</MenuItem>
            </Select>
          </Box>

          <TextField
            id="inputField"
            label="Enter text to summarize or translate"
            variant="outlined"
            multiline
            rows={20}
            fullWidth
          />

          <Box className="submit-row">
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default App
