
import "./App.css";
import FCPanoramaViewer from "./components/PanoramaViewer";

function App() {
  const imgUrl = "sample1.jpg";
  // const imgUrl = "mandrill.png";
  return (
    <div className="fullScreenContainer">
      <h1>React Three Fiber Image</h1>

      <FCPanoramaViewer imgUrl={imgUrl} />
    </div>
  );
}

export default App;
