import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import { Toaster } from "react-hot-toast"
import Navigation from "./pages/Navigation"
import Counter from "./pages/Counter"

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={ <Navigation /> }>
          <Route index element={ <Home /> } />
          <Route path="/profile" element={ <Profile /> } />
        </Route>
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/counter" element={ <Counter /> } />
      </Routes>
    </Router>
  )
}

export default App
