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

const containsFinnishSSN = (text: string): boolean => {
  // Finnish SSN format: DDMMYYXNNNT
  // X = '+' (1800s), '-' (1900s), or 'A' (2000s)
  // T = digit or letter
  const finnishSSNPattern = /\d{6}[-+A]\d{3}[0-9A-Z]/i;
  return finnishSSNPattern.test(text);
};

function App() {
  const [language, setLanguage] =  React.useState('English');
  const [translate, setTranslate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState(true);
  const [tonality, setTonality] = React.useState('Formal');
  const [styling, setStyling] = React.useState('Paragraph');
  const [modelProvider, setModelProvider] = React.useState('openai');

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

    // Also cache theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme(true);
    } else {
      setTheme(false);
    }
  }, []);

  const handleSubmit = async () => {
    const inputField = document.getElementById('inputField') as HTMLInputElement;
    const userInput = inputField.value;

    if (containsFinnishSSN(userInput)) {
      alert("Input contains a Finnish SSN. Please remove it before submitting.");
      return;
    }

    setLoading(true);
    try {
      setSummary(null);
      const summary = await summarizeText(userInput, translate ? language : null, tonality, styling, modelProvider);
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
    localStorage.setItem('theme', event.target.checked ? 'dark' : 'light');
  }

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const text = await file.text();
      const inputField = document.getElementById('inputField') as HTMLInputElement;
      inputField.value = text;
      setInputToLocalStorage(text);
      inputField.focus();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

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

            <Select
              labelId="tonality-select-label"
              id="tonality-select"
              value={tonality}
              label="Tonality"
              size="small"
              onChange={(e) => setTonality(e.target.value as string)}
            >
              <MenuItem value={'Formal'}>Formal</MenuItem>
              <MenuItem value={'Informal'}>Informal</MenuItem>
            </Select>

            <Select
              labelId="styling-select-label"
              id="styling-select"
              value={styling}
              label="Styling"
              size="small"
              onChange={(e) => setStyling(e.target.value as string)}
            >
              <MenuItem value={'Paragraph'}>Paragraph</MenuItem>
              <MenuItem value={'Bullet Points'}>Bullet Points</MenuItem>
            </Select>

            <Select
              labelId="provided-select-label"
              id="provider-select"
              value={modelProvider}
              label="Model Provider"
              size="small"
              onChange={(e) => setModelProvider(e.target.value as string)}
            >
              <MenuItem value={'openai'}>OpenAI</MenuItem>
              <MenuItem value={'google'}>Google</MenuItem>
            </Select>

            <FormGroup>
              <FormControlLabel
                control={<Switch checked={theme} defaultChecked onChange={handleThemeChange} />}
                label="Dark Mode"
              />
            </FormGroup>
          </Box>

          <Box
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            sx={{ width: '100%' }}
          >
            <TextField
              id="inputField"
              label="Enter text to summarize or translate  (or drop a file here)"
              variant="outlined"
              multiline
              rows={20}
              fullWidth
              onChange={(e) => setInputToLocalStorage(e.target.value as string)}
            />
          </Box>

          <Box className="submit-row"  sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleClearInput} disabled={loading}>Clear</Button>

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
      </ThemeProvider>
    </>
  )
}

export default App
