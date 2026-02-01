import { useState } from 'react'
import { summarizeText } from './services/api'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleSubmit = async () => {
    const inputField = document.getElementById('inputField') as HTMLInputElement;
    const userInput = inputField.value;

    try {
      await summarizeText(userInput).then(summary => {
        // Change the input field value to the summary
        inputField.value = summary;
      });
    } catch (error) {
      alert('Error summarizing text: ' + error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <input id="inputField" type="text" placeholder="Enter text to summarize or translate" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}

export default App
