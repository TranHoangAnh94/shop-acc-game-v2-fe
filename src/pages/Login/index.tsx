import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaUser } from "react-icons/fa";
import { HiEye } from "react-icons/hi";
import { showAlert, setCookie } from "../../utils/functions";
import { BsEyeSlashFill } from "react-icons/bs";
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const [isShowPasssword, setIsShowPasssword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            username: data.username,
            password: data.password,
        };

        try {
            const res = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = (json && json.message) || "Đăng nhập thất bại";
                throw new Error(msg);
            }

            const access = json?.result?.access_token;
            const refresh = json?.result?.refresh_token;
            if (access) setCookie("access_token", access, 7);
            if (refresh) setCookie("refresh_token", refresh, 30);

            // Persist minimal user info into context/localStorage: name + access_token
            const minimalUser = { name: data.username, access_token: access };
            login(minimalUser);

            await showAlert("success", json.message || "Đăng nhập thành công!");
            navigate("/");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showAlert("error", msg || "Có lỗi khi đăng nhập");
        }
    };

    const handleShowPassword = () => {
        setIsShowPasssword((is) => !is);
    };

    return (
        <>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800">Tài Khoản</label>
                    <div className="relative flex items-center">
                        <input
                            name="username"
                            type="text"
                            onChange={handleChange}
                            value={data?.username}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                            placeholder="Tài khoản"
                        />
                        <FaUser className="ht-icon absolute right-4" />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800">Mật Khẩu</label>
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            type={isShowPasssword ? "text" : "password"}
                            onChange={handleChange}
                            value={data?.password}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-800"
                            placeholder="Mật khẩu của bạn"
                        />
                        {isShowPasssword ? (
                            <BsEyeSlashFill
                                className="ht-icon absolute right-4 cursor-pointer"
                                onClick={handleShowPassword}
                            />
                        ) : (
                            <HiEye className="ht-icon absolute right-4 cursor-pointer" onClick={handleShowPassword} />
                        )}
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-end gap-4">
                    <div className="text-sm">
                        <Link to={"/forgot-password"} className="ht-item-achor">
                            Bạn Quên Mật Khẩu?
                        </Link>
                    </div>
                </div>

                <div className="mt-6">
                    <Button variant={"primary"} type="submit" className="w-full">
                        Đăng Nhập
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Login;
