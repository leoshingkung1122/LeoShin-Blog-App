import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />
      </Routes>
    </Router>
  )
}

export default App
