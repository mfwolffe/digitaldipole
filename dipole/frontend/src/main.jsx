import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// [x] TOASK forgot how to stop double renders w/out disabling strict mode
//           by design, though theoretically shouldn't happen due to 
//           autobuild

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* <App username={username}/> */}
        <App />
    </React.StrictMode>
)

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <App />
// )
