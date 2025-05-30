// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {RouterProvider} from "react-router-dom"
import router from './routes/AppRoutes'

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
