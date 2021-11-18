import { BrowserRouter, Route, Routes } from "react-router-dom";
// @ts-ignore
import { Login } from "../pages/Login.tsx";
// @ts-ignore
import { Register } from "../pages/Register.tsx";
// @ts-ignore
import { Home } from "../pages/Home.tsx";

export function RouterLayout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
