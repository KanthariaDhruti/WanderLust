import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Index from "./components/Index";
import Show from "./components/Show";
import New from "./components/New";
import Edit from "./components/Edit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Signup from "./components/Signup";
import Review from "./components/Review";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthContext";
import User from "./components/User";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Index />} />
            <Route path="/listings/:id" element={<Show />} />
            <Route path="/listings/new" element={<New />} />
            <Route path="/listings/:id/edit" element={<Edit />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<User />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
