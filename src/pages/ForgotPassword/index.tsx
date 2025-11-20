import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaEnvelope } from "react-icons/fa";
import { showAlert } from "../../utils/functions";
import { Button } from "~/components/ui/button";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = (json && json.message) || "Có lỗi xảy ra";
                throw new Error(msg);
            }

            setSuccess(true);
            await showAlert("success", json.message || "Email đặt lại mật khẩu đã được gửi!");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showAlert("error", msg || "Có lỗi khi gửi email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">Quên mật khẩu?</h2>
                    <p className="text-sm text-gray-600">
                        {success
                            ? "Kiểm tra email của bạn để đặt lại mật khẩu"
                            : "Nhập email của bạn để nhận link đặt lại mật khẩu"}
                    </p>
                </div>

                {success ? (
                    <div className="space-y-6">
                        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                                <svg
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                Email đã được gửi đến <strong>{email}</strong>
                            </p>
                            <p className="mt-2 text-xs text-gray-600">
                                Vui lòng kiểm tra hộp thư đến hoặc thư rác của bạn
                            </p>
                        </div>

                        <Link to="/login">
                            <Button variant="primary" className="w-full">
                                Quay lại đăng nhập
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
                            <div className="relative flex items-center">
                                <input
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    value={email}
                                    required
                                    className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 pr-10 text-sm text-slate-800"
                                    placeholder="email@example.com"
                                />
                                <FaEnvelope className="ht-icon absolute right-4 text-gray-400" />
                            </div>
                        </div>

                        <Button variant="primary" type="submit" className="w-full" disabled={loading}>
                            {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
