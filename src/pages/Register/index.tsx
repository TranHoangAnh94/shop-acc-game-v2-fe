import { FaUser } from "react-icons/fa";
import { HiEye } from "react-icons/hi";
import { showAlert } from "../../utils/functions";
import { BsEyeSlashFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
        confirm_password: "",
        email: "",
    });
    const [isShowPasssword, setIsShowPasssword] = useState(false);
    const handleChange = (e: any) => {
        setData((data) => ({
            ...data,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Basic validation
        if (!data.username || !data.password) {
            showAlert("error", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        // Password complexity: at least 1 uppercase, 1 digit, 1 special character
        const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+/;
        if (!passwordRegex.test(data.password)) {
            showAlert("error", "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt.");
            return;
        }

        if (data.password !== data.confirm_password) {
            showAlert("error", "Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        const payload = {
            username: data.username,
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
        };

        fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    const msg = (json && json.message) || "Đăng ký thất bại";
                    throw new Error(msg);
                }
                return json;
            })
            .then((data) => {
                // API returns { message, result: { access_token, refresh_token } }
                showAlert("success", data.message || "Đăng ký thành công!").then(() => {
                    // Do not store tokens for now (per request)
                    navigate("/login");
                });
            })
            .catch((err: any) => {
                showAlert("error", err?.message || "Có lỗi khi đăng ký");
            });
    };
    const handleShowPassword = () => {
        setIsShowPasssword((is) => !is);
    };
    const navigate = useNavigate();
    return (
        <>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Tài Khoản</label>
                    <div className="relative flex items-center">
                        <input
                            name="username"
                            type="text"
                            onChange={handleChange}
                            value={data?.username}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-800"
                            placeholder="Tên tài khoản của bạn"
                        />
                        <FaUser className="ht-icon absolute right-4 max-sm:hidden" />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Địa Chỉ Email</label>
                    <div className="relative flex items-center">
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            value={data?.email}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-800"
                            placeholder="Không bắt buộc (Dùng để lấy lại mật khẩu)"
                        />
                        <MdEmail className="ht-icon absolute right-4 max-sm:hidden" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Mật Khẩu</label>
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            type={isShowPasssword ? "text" : "password"}
                            onChange={handleChange}
                            value={data?.password}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-800"
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

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Xác Nhận Mật Khẩu</label>
                    <div className="relative flex items-center">
                        <input
                            name="confirm_password"
                            type={isShowPasssword ? "text" : "password"}
                            onChange={handleChange}
                            value={data?.confirm_password}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-800"
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <Button variant={"primary"} type="submit" className="w-full">
                        Tạo Tài Khoản
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Register;
