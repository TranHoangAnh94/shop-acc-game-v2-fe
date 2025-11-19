import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";

const EditAccountPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        price: "",
        thumb: "",
        images: "",
        details: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchAccountData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchAccountData = async () => {
        try {
            setLoadingData(true);
            const response = await fetch(`http://localhost:8000/game-accounts/detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.result) {
                const account = data.result;
                setFormData({
                    name: String(account.name ?? ""),
                    password: String(account.password ?? ""),
                    price: String(account.price ?? ""),
                    thumb: String(account.thumb ?? ""),
                    images: String(account.images ?? ""),
                    details: account.details ? JSON.stringify(account.details, null, 2) : "",
                });
            } else {
                setError("Không thể tải thông tin account");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Parse details as JSON if provided
            let detailsObj = {};
            if (formData.details) {
                try {
                    detailsObj = JSON.parse(formData.details);
                } catch {
                    setError("Details phải là JSON hợp lệ");
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(`http://localhost:8000/game-accounts/account-detail/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    password: formData.password,
                    price: Number(formData.price),
                    thumb: formData.thumb,
                    images: formData.images,
                    details: detailsObj,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cập nhật account thành công!");
                navigate("/thong-tin");
            } else {
                setError(data.message || "Có lỗi xảy ra");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
                <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">Sửa Account Game</h2>

            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium text-gray-700">
                        Tên tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Nhập tên tài khoản"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Mật khẩu</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">
                        Giá <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Nhập giá"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Thumbnail URL</label>
                    <input
                        type="text"
                        name="thumb"
                        value={formData.thumb}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Nhập URL hình ảnh thumbnail"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Images (phân cách bằng dấu phẩy)</label>
                    <input
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Nhập URLs hình ảnh, phân cách bằng dấu phẩy"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Details (JSON format)</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        rows={4}
                        placeholder='{"tuong": 100, "trang_phuc": 50}'
                    />
                    <p className="mt-1 text-xs text-gray-500">Nhập dữ liệu dạng JSON</p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/thong-tin")}
                        className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAccountPage;
