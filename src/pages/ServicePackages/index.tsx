import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatNumber } from "~/utils/functions";
import HeadLine from "~/components/Headline";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { useAuth } from "~/context/AuthContext";

export default function ServicePackagesPage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [packages, setPackages] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form order states
    const [selectedPackage, setSelectedPackage] = useState<Record<string, unknown> | null>(null);
    const [orderForm, setOrderForm] = useState({
        accountName: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!serviceId) return;
        const controller = new AbortController();
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:8000/service-packages/${serviceId}`, {
                    signal: controller.signal,
                });

                // Check if response is ok
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                // Check content type
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    console.error("Response is not JSON:", text.substring(0, 200));
                    throw new Error(`API không trả về JSON. Content-Type: ${contentType || "unknown"}`);
                }

                const data = await res.json();
                console.log("Service packages API response:", data);

                // Try multiple possible data structures
                let list: Array<Record<string, unknown>> = [];
                if (data?.result?.data && Array.isArray(data.result.data)) {
                    list = data.result.data;
                } else if (data?.result && Array.isArray(data.result)) {
                    list = data.result;
                } else if (Array.isArray(data)) {
                    list = data;
                }

                console.log("Parsed packages list:", list);
                setPackages(list as Array<Record<string, unknown>>);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Failed to load service packages:", err);
                setError(msg);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [serviceId]);

    const handleSelectPackage = (pkg: Record<string, unknown>) => {
        setSelectedPackage(pkg);
        // Scroll to form
        setTimeout(() => {
            document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage || !serviceId) return;

        if (!user?.access_token) {
            alert("Vui lòng đăng nhập để đặt dịch vụ!");
            navigate("/login");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8000/orders/${serviceId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({
                    servicePackageId: selectedPackage.id,
                    accountName: orderForm.accountName,
                    password: orderForm.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
                setOrderForm({
                    accountName: "",
                    password: "",
                });
                setSelectedPackage(null);
            } else {
                alert(data.message || "Có lỗi xảy ra. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Submit order error:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="px-4 py-6">
            <HeadLine title="Gói Dịch Vụ Cày Thuê" url="" type="service" />

            {/* Service Info Section */}
            <div className="mb-6 rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                        <FaShoppingCart className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Hướng Dẫn Đặt Dịch Vụ</h3>
                        <p className="text-sm text-gray-600">Quy trình đơn giản, nhanh chóng</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                            1
                        </div>
                        <div>
                            <h4 className="mb-1 font-semibold text-gray-800">Chọn Gói Dịch Vụ</h4>
                            <p className="text-xs text-gray-600">Click vào gói dịch vụ bạn muốn đặt</p>
                        </div>
                    </div>

                    <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                            2
                        </div>
                        <div>
                            <h4 className="mb-1 font-semibold text-gray-800">Điền Thông Tin</h4>
                            <p className="text-xs text-gray-600">Nhập thông tin tài khoản và yêu cầu</p>
                        </div>
                    </div>

                    <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                            3
                        </div>
                        <div>
                            <h4 className="mb-1 font-semibold text-gray-800">Thanh Toán</h4>
                            <p className="text-xs text-gray-600">Hoàn tất đơn hàng và chờ xử lý</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-blue-200 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BsLightningChargeFill className="text-yellow-500" />
                        <span className="font-semibold">Xử lý nhanh chóng</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-semibold">Uy tín - Bảo mật</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="font-semibold">Hỗ trợ 24/7</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="p-4 text-center">Đang tải gói dịch vụ...</p>
            ) : error ? (
                <div className="p-4 text-center">
                    <p className="mb-2 font-semibold text-red-600">Lỗi: {error}</p>
                    <p className="text-sm text-gray-600">
                        Endpoint:{" "}
                        <code className="rounded bg-gray-100 px-2 py-1">GET /service-packages/{serviceId}</code>
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        Kiểm tra backend đã implement endpoint này chưa hoặc xem console để biết thêm chi tiết.
                    </p>
                </div>
            ) : packages.length === 0 ? (
                <div className="p-4 text-center">
                    <p className="text-gray-600">Không có gói dịch vụ nào cho dịch vụ này.</p>
                    <p className="mt-2 text-xs text-gray-500">Service ID: {serviceId}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packages.map((pkg, idx) => {
                        const title = String(pkg["name"] ?? pkg["title"] ?? "Không có tên");
                        const price = Number(pkg["price"] ?? 0) || 0;
                        const packageId = String(pkg.id ?? "");
                        const description = String(pkg["description"] ?? "");

                        return (
                            <div
                                key={packageId || `no-id-${idx}`}
                                onClick={() => handleSelectPackage(pkg)}
                                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl"
                            >
                                {/* Badge "HOT" cho top 3 */}
                                {idx < 3 && (
                                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                        <BsLightningChargeFill className="text-sm" />
                                        <span>HOT</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-6">
                                    {/* Title */}
                                    <h3 className="mb-3 line-clamp-2 text-center text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                                        {title}
                                    </h3>

                                    {/* Description */}
                                    {description && (
                                        <p className="mb-4 line-clamp-3 text-center text-sm text-gray-600">
                                            {description}
                                        </p>
                                    )}

                                    {/* Price */}
                                    <div className="mb-4 text-center">
                                        <div className="text-2xl font-extrabold text-blue-600">
                                            {formatNumber(price)} ₫
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg">
                                        ĐẶT NGAY
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Form Section */}
            <div id="order-form" className="mt-12 scroll-mt-20">
                <div className="rounded-xl border-2 border-blue-200 bg-white p-6 shadow-xl md:p-8">
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">Đặt Dịch Vụ Cày Thuê</h2>
                        <p className="text-sm text-gray-600">Điền thông tin bên dưới để đặt dịch vụ</p>
                    </div>

                    {selectedPackage && (
                        <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                                    ✓
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">Gói đã chọn:</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {String(selectedPackage.name ?? selectedPackage.title ?? "")}
                                    </p>
                                    <p className="text-sm font-bold text-blue-600">
                                        Giá: {formatNumber(Number(selectedPackage.price ?? 0))} ₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmitOrder} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Account Name */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaUser className="text-blue-500" />
                                    Tên tài khoản game <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountName"
                                    value={orderForm.accountName}
                                    onChange={handleOrderFormChange}
                                    placeholder="Nhập tên tài khoản game"
                                    required
                                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaShoppingCart className="text-blue-500" />
                                    Mật khẩu tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="password"
                                    value={orderForm.password}
                                    onChange={handleOrderFormChange}
                                    placeholder="Nhập mật khẩu tài khoản"
                                    required
                                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting || !selectedPackage}
                                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-4 text-lg font-bold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Đang xử lý..." : "XÁC NHẬN ĐẶT DỊCH VỤ"}
                            </button>
                            {selectedPackage && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedPackage(null)}
                                    className="rounded-lg border-2 border-gray-300 px-6 py-4 text-sm font-semibold text-gray-700 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    Hủy
                                </button>
                            )}
                        </div>

                        {!selectedPackage && (
                            <p className="text-center text-sm text-gray-500">
                                Vui lòng chọn một gói dịch vụ bên trên để đặt hàng
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
