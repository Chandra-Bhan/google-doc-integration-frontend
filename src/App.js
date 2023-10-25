import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import DocumentIDExtractor from "./components/DocumentIDExtractor";
import FileUploadForm from "./components/DocumentIDExtractor";

function App() {
  return (
    <div className="App">
      <div>
        <FileUploadForm />
      </div>
    </div>
  );
}

export default App;
