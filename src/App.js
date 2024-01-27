import {Routes,Route} from "react-router-dom";
import Home from "./views/home/index";
import Example from "./views/example/example";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/example" element={<Example/>}></Route>
        </Routes>

    </div>
  );
}

export default App;
