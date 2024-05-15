import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // eslint-disable-line

function App() {
  return (
    <div className="App">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
