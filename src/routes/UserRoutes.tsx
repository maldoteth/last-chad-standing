// src/routes/UserRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Game from "@/pages/Game";
import Documents from "@/pages/Documents";
import Blog from "@/pages/Blog";
import PreOrderSuccess from "@/pages/PreOrderSuccess";
import PreOrderCancel from "@/pages/PreOrderCancel";
import NotFound from "@/pages/NotFound";
import { CheckPrivy } from "@/lib/checkPrivy";
import AdminLogin from "@/components/AdminLogin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Admin from "@/pages/Admin";
// import { NFTDeployMintRefactored } from "@/components/NFTDeployMintRefactored";

const UserRoutes = () => {
  const isAdmin = isAdminAuthenticated()
  return (
    <Routes>
      <Route path="/admin/login" element={isAdmin ? <Navigate to={'/admin'} /> : <AdminLogin />} />
      <Route path="/admin" element={!isAdmin ? <Navigate to={'/admin/login'} /> : <Admin />} />
      
      {/* <Route path="/nft" element={<NFTDeployMintRefactored />} /> */}
      <Route path="/" element={isAdmin ? <Navigate to={'/admin'} /> :  <Game />} />
      <Route path="/docs" element={<Documents />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/preorder-success" element={<PreOrderSuccess />} />
      <Route path="/preorder-cancel" element={<PreOrderCancel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
};

export default UserRoutes;
