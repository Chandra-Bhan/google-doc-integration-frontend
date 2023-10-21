import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import DocumentIDExtractor from "./components/DocumentIDExtractor";
import FileUploadForm from "./components/DocumentIDExtractor";
import Authentication from "./components/Authenticate";
import { BrowserRouter, Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Authentication />
        </BrowserRouter>
        <FileUploadForm />
      </div>
    </div>
  );
}

export default App;
