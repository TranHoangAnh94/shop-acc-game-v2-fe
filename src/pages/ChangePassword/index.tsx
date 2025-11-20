import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { HiEye } from "react-icons/hi";
import { BsEyeSlashFill } from "react-icons/bs";
import { showAlert } from "../../utils/functions";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user?.access_token) {
            showAlert("error", "Vui lòng đăng nhập để đổi mật khẩu!");
            navigate("/login");
            return;
        }

        // Validate passwords match
        if (formData.new_password !== formData.confirm_password) {
            showAlert("error", "Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        // Validate password length
        if (formData.new_password.length < 6) {
            showAlert("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        // Check if new password is same as old password
        if (formData.old_password === formData.new_password) {
            showAlert("error", "Mật khẩu mới không được trùng với mật khẩu cũ!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({
                    old_password: formData.old_password,
                    new_password: formData.new_password,
                    confirm_new_password: formData.confirm_password,
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = (json && json.message) || "Có lỗi xảy ra";
                throw new Error(msg);
            }

            await showAlert("success", json.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

            // Logout and redirect to login
            logout(navigate);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showAlert("error", msg || "Có lỗi khi đổi mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto my-8 flex justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">Đổi mật khẩu</h2>
                    <p className="text-sm text-gray-600">Nhập mật khẩu cũ và mật khẩu mới của bạn</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Old Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Mật khẩu cũ</label>
                        <div className="relative flex items-center">
                            <input
                                name="old_password"
                                type={showOldPassword ? "text" : "password"}
                                onChange={handleChange}
                                value={formData.old_password}
                                required
                                className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                                placeholder="Nhập mật khẩu cũ"
                            />
                            {showOldPassword ? (
                                <BsEyeSlashFill
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowOldPassword(false)}
                                />
                            ) : (
                                <HiEye
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowOldPassword(true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Mật khẩu mới</label>
                        <div className="relative flex items-center">
                            <input
                                name="new_password"
                                type={showNewPassword ? "text" : "password"}
                                onChange={handleChange}
                                value={formData.new_password}
                                required
                                className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                                placeholder="Nhập mật khẩu mới"
                            />
                            {showNewPassword ? (
                                <BsEyeSlashFill
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowNewPassword(false)}
                                />
                            ) : (
                                <HiEye
                                    className="ht-icon absolute right-4 cursor-pointer"
                                    onClick={() => setShowNewPassword(true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Xác nhận mật khẩu mới</label>
                        <div className="relative flex items-center">
                            <input
                                name="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={handleChange}
                                value={formData.confirm_password}
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

                    <div className="flex gap-3">
                        <Button variant="primary" type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate("/thong-tin")}
                            className="rounded-lg border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                    </div>
                </form>

                <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-xs text-yellow-800">
                        <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ cần đăng nhập lại với mật khẩu
                        mới.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
