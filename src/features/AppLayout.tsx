import Footer from "@/components/Footer";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import ProgressBar from "@/components/ProgressBar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import { getCurrentUser } from "@/lib/services/profile-service";
import { logout, setUserData } from "@/lib/store/slices/authSlice";
import { RootState, AppDispatch } from "@/lib/store/store";
import { useQuery } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AppLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
        // refetchInterval: 30000,
    });

    useEffect(() => {
        if (isLoading) return;

        const handleLogout = () => {
            dispatch(logout())
                .unwrap()
                .finally(() => {
                    window.location.href = '/';
                });
        };

        if (isError || !data?.result) {
            handleLogout();
        } else {
            dispatch(setUserData(data.user));
        }
    }, [data, isLoading, isError, dispatch]);

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const defaultOpen = Cookies.get('sidebar:state') !== 'false';

    return (
        <SearchProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset className=" overflow-x-hidden">
                    <Header />
                    <Outlet />
                    <Footer />
                </SidebarInset>
                <ProgressBar />
            </SidebarProvider>
        </SearchProvider>
    );
}
