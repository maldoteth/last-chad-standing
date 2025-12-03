// src/routes/AdminRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "@/pages/Admin";
import AdminLogin from "@/components/AdminLogin";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "./privateRoute";

const AdminRoutes = ({ isAdmin }) => (
  <Routes>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin"
      element={
        <PrivateRoute isAllowed={isAdmin} redirectTo="/admin/login">
          <Admin />
        </PrivateRoute>
      }
    />
     <Route path="/" element={<Navigate to={'/admin'} /> } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AdminRoutes;
