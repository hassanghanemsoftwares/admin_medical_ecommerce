import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { RootState } from "@/lib/store/store";
import Footer from "@/components/Footer";


export default function AuthLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
   
        <ProgressBar />
        <Outlet />
    
      <Footer />
    </div>
  );
}