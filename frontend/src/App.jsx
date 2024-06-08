import { Outlet } from "react-router-dom";
import Navigation from "./components/pages/Auth/Navigation";
import { ToastContainer } from "react-toastify"; // Corrected package name
import "react-toastify/dist/ReactToastify.css"; // Corrected package name

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
      <Outlet/>
      </main>
    </>
  );
}

export default App;
