import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowProducts from "./components/ShowProducts";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowProducts></ShowProducts>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
