import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import HeadLine from "~/components/Headline";
import { formatNumber } from "~/utils/functions";
import { FaArrowLeft } from "react-icons/fa";

export default function AccountDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const stateAccount = (location.state as { account?: Record<string, unknown> })?.account;

    const [account, setAccount] = useState<Record<string, unknown> | null>(stateAccount ?? null);
    const [loading, setLoading] = useState(!stateAccount);
    const [error, setError] = useState<string | null>(null);
    const [purchasing, setPurchasing] = useState(false);
    const [, setPurchaseSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        (async function load() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/game-accounts/detail/${id}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                setAccount(data.result ?? null); // Luôn lấy từ API
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [id]);

    const handlePurchase = async () => {
        if (!id || purchasing) return;

        try {
            setPurchasing(true);
            const res = await fetch(`http://localhost:8000/game-accounts/${id}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPurchaseSuccess(true);
                // Reload account data to update status
                const accountRes = await fetch(`http://localhost:8000/game-accounts/detail/${id}`);
                const accountData = await accountRes.json();
                setAccount(accountData.result ?? null);

                alert("Mua tài khoản thành công!");
            } else {
                alert(data.message || "Có lỗi xảy ra khi mua tài khoản");
            }
        } catch (err) {
            alert("Có lỗi xảy ra: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setPurchasing(false);
        }
    };

    // -------------------------
    // Xử lý images
    // -------------------------
    function parseImages(a: Record<string, unknown> | null) {
        if (!a) return [];
        const images = a["images"] ?? a["imgs"] ?? a["thumbnails"];
        if (!images) return [];

        if (Array.isArray(images))
            return images
                .map(String)
                .map((s) => s.trim())
                .filter(Boolean);

        if (typeof images === "string") {
            // try parse as JSON array first
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed))
                    return parsed
                        .map(String)
                        .map((s) => s.trim())
                        .filter(Boolean);
            } catch {
                // not JSON, continue
            }
            // fallback: split by comma
            return images
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }

        return [];
    }

    function getImageUrl(src?: string) {
        if (!src) return "";
        try {
            if (typeof src !== "string") return "";
            const s = src.trim();
            if (!s) return "";
            if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
            return "/" + s.replace(/^\/+/, "");
        } catch {
            return "";
        }
    }

    const imgs = parseImages(account);
    console.log("ACCOUNT OBJECT:", account);

    return (
        <div className="px-4 py-6">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-blue-50"
                >
                    <FaArrowLeft /> Quay lại
                </button>
            </div>

            <HeadLine title="Chi tiết tài khoản" url="" type="account" />

            {loading ? (
                <p className="p-4 text-center">Đang tải...</p>
            ) : error ? (
                <p className="p-4 text-center text-red-600">Lỗi: {error}</p>
            ) : !account ? (
                <p className="p-4 text-center">Không tìm thấy tài khoản.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Left: Thumbnail */}
                    <div className="md:col-span-1">
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                            <img
                                src={String(account["thumb"] ?? "")}
                                alt="thumb"
                                className="aspect-square w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-5 md:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-2xl font-bold text-gray-800">
                                {String(account["name"] ?? "Không có tên")}
                            </h2>

                            <div className="mb-4 flex items-baseline gap-2">
                                <span className="text-sm font-medium text-gray-600">Giá:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatNumber(Number(account["price"] ?? 0))} ₫
                                </span>
                            </div>

                            {/* Purchase Button */}
                            <div className="mb-4">
                                <button
                                    onClick={handlePurchase}
                                    disabled={Number(account["status"]) !== 0 || purchasing}
                                    className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition ${
                                        Number(account["status"]) === 0 && !purchasing
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "cursor-not-allowed bg-gray-400"
                                    }`}
                                >
                                    {purchasing
                                        ? "Đang xử lý..."
                                        : Number(account["status"]) === 0
                                          ? "Mua ngay"
                                          : "Đã bán"}
                                </button>
                            </div>

                            {/* Details */}
                            <div className="mt-5">
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Thông tin chi tiết</h3>
                                <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    {account["details"] && typeof account["details"] === "object" ? (
                                        Object.entries(account["details"] as Record<string, unknown>).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 capitalize">
                                                        {key.replace(/_/g, " ")}:
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-500">Không có thông tin chi tiết</p>
                                    )}
                                </div>
                            </div>

                            {/* Extra images */}
                            {imgs.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Hình ảnh</h3>
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                        {imgs.map((url, i) => (
                                            <img
                                                key={i}
                                                src={getImageUrl(url) || "/images/default-card.png"}
                                                alt={`img-${i}`}
                                                className="aspect-video w-full rounded-lg border border-gray-200 object-cover transition hover:border-blue-500"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    if (!img || typeof img.src !== "string") return;
                                                    if (img.src.includes("default-card.png")) return;
                                                    img.src = "/images/default-card.png";
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
