import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { HiEye } from "react-icons/hi";
import { BsEyeSlashFill } from "react-icons/bs";
import { showAlert } from "../../utils/functions";
import { Button } from "~/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showAlert("error", "Mật khẩu xác nhận không khớp!");
            return;
        }

        if (password.length < 6) {
            showAlert("error", "Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:8000/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = (json && json.message) || "Có lỗi xảy ra";
                throw new Error(msg);
            }

            await showAlert("success", json.message || "Đặt lại mật khẩu thành công!");
            navigate("/login");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showAlert("error", msg || "Có lỗi khi đặt lại mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                    <p className="text-sm text-gray-600">Nhập mật khẩu mới của bạn</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Mật khẩu mới</label>
                        <div className="relative flex items-center">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                value={password}
                                required
                                className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                                placeholder="Nhập mật khẩu mới"
                            />
                            {showPassword ? (
                                <BsEyeSlashFill
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <HiEye
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowPassword(true)}
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Xác nhận mật khẩu</label>
                        <div className="relative flex items-center">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                required
                                className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            {showConfirmPassword ? (
                                <BsEyeSlashFill
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(false)}
                                />
                            ) : (
                                <HiEye
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(true)}
                                />
                            )}
                        </div>
                    </div>

                    <Button variant="primary" type="submit" className="w-full" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </Button>

                    <div className="text-center">
                        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
