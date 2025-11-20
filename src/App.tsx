import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import UserLayout from "./layouts/UserLayout";
import HomePage from "./pages/Home";
import CategoryGroupsPage from "./pages/CategoryGroups";
import GroupAccountsPage from "./pages/GroupAccounts";
import AccountDetailPage from "./pages/AccountDetail";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountPage from "./pages/Account";
import AddUserPage from "./pages/Account/AddUser";
import AddAccountPage from "./pages/Account/AddAccount";
import EditAccountPage from "./pages/Account/EditAccount";
import ServicePackagesPage from "./pages/ServicePackages";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient();
const App = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<UserLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="categories/:id" element={<CategoryGroupsPage />} />
                            <Route path="group/:id/accounts" element={<GroupAccountsPage />} />
                            <Route path="accounts/:id" element={<AccountDetailPage />} />
                            <Route path="dich-vu/:serviceId" element={<ServicePackagesPage />} />
                            <Route path="/thong-tin" element={<AccountPage />} />
                            <Route path="/login" element={<AuthenticationLayout title="Đăng Nhập" page="login" />}>
                                <Route index element={<Login />} />
                            </Route>
                            <Route path="/register" element={<AuthenticationLayout title="Đăng Ký" page="register" />}>
                                <Route index element={<Register />} />
                            </Route>
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                        <Route path="/admin/add-user" element={<AddUserPage />} />
                        <Route path="/admin/add-account" element={<AddAccountPage />} />
                        <Route path="/admin/edit-account/:id" element={<EditAccountPage />} />
                    </Routes>
                </QueryClientProvider>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
