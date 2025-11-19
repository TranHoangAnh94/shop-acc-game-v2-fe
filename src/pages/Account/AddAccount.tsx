import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";

const AddAccountPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [groups, setGroups] = useState<Array<Record<string, unknown>>>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    const [formData, setFormData] = useState({
        groupId: "",
        name: "",
        password: "",
        price: "",
        thumbFile: null as File | null,
        imageFiles: [] as File[],
        details: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch groups on mount
    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch("http://localhost:8000/game-groups", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const items =
                    data?.result?.data && Array.isArray(data.result.data)
                        ? data.result.data
                        : Array.isArray(data.result)
                          ? data.result
                          : [];
                setGroups(items);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, thumbFile: e.target.files![0] }));
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({ ...prev, imageFiles: Array.from(e.target.files!) }));
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user?.access_token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Upload failed");
        }

        return data.result?.path || data.path || "";
    };

    const parseDetailsToJSON = (detailsString: string): Record<string, unknown> => {
        if (!detailsString.trim()) return {};

        const result: Record<string, unknown> = {};
        const pairs = detailsString.split(",");

        for (const pair of pairs) {
            const [key, value] = pair.split(":").map((s) => s.trim());
            if (key && value) {
                // Try to parse as number, otherwise keep as string
                const numValue = Number(value);
                result[key] = isNaN(numValue) ? value : numValue;
            }
        }

        return result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.groupId || !formData.name || !formData.price) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Upload thumbnail
            let thumbPath = "";
            if (formData.thumbFile) {
                thumbPath = await uploadImage(formData.thumbFile);
            }

            // Upload images
            const imagePaths: string[] = [];
            for (const file of formData.imageFiles) {
                const path = await uploadImage(file);
                imagePaths.push(path);
            }

            // Parse details
            const detailsObj = parseDetailsToJSON(formData.details);

            const response = await fetch(`http://localhost:8000/game-accounts/${formData.groupId}/account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    password: formData.password,
                    price: Number(formData.price),
                    thumb: thumbPath,
                    images: imagePaths.join(","),
                    details: detailsObj,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Thêm account thành công!");
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

    return (
        <div className="mx-auto mt-10 max-w-2xl rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">Thêm Account Game</h2>

            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium text-gray-700">
                        Nhóm Game <span className="text-red-500">*</span>
                    </label>
                    {loadingGroups ? (
                        <p className="text-sm text-gray-500">Đang tải nhóm game...</p>
                    ) : (
                        <select
                            name="groupId"
                            value={formData.groupId}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        >
                            <option value="">-- Chọn nhóm game --</option>
                            {groups.map((group) => (
                                <option key={String(group.id)} value={String(group.id)}>
                                    {String(group.title || group.name || "Không có tên")}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

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
                    <label className="mb-1 block font-medium text-gray-700">Thumbnail (Hình đại diện)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbChange}
                        className="w-full rounded border p-2"
                    />
                    {formData.thumbFile && (
                        <p className="mt-1 text-sm text-gray-600">Đã chọn: {formData.thumbFile.name}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Hình ảnh (Nhiều file)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="w-full rounded border p-2"
                    />
                    {formData.imageFiles.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                            Đã chọn {formData.imageFiles.length} file:{" "}
                            {formData.imageFiles.map((f) => f.name).join(", ")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block font-medium text-gray-700">Chi tiết (key:value)</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        rows={4}
                        placeholder="tuong:100, trang phuc:50, skin:30"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Nhập dạng: key:value, phân cách bằng dấu phẩy. VD: tuong:100, trang phuc:50
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? "Đang xử lý..." : "Thêm account"}
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

export default AddAccountPage;
