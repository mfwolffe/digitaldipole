import { useState } from 'react'
import reactLogo from './assets/react.svg'
import djangoLogo from './assets/ethyl-acetate.svg'
import viteLogo from './assets/benzene-oxide.svg'
// import Button from 'react-bootstrap/Button'
import './App.css'

// function App({username}) {
function App() {
  console.log("username is ", username);
  console.log(window);
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Digital Dipole</h1>
        <h2>A Chemistry Education Tool</h2>
        <h3>Powered by:</h3>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.djangoproject.com/" target="_blank">
          <img src={djangoLogo} className="logo" alt="Django logo" />
        </a>
      </div>
      <h2>Vite + React + Django</h2>
      <p>
          Edit <code>src/App.jsx</code> and save to test HMR
      </p>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        <p>
          You are logged in as <b>{username}</b>.
        </p>

        <button href='#'>Continue to Site</button>
      </div>
      <p className="read-the-docs">
        Click on the React logo or spinning molecules to learn more.
      </p>
      <p className="read-the-docs">
        (first is Vite, second React, third Django)
      </p>
    </>
  )
}

export default App
