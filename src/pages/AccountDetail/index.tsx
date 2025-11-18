import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

export default function AccountDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const stateAccount = (location.state as any)?.account as Record<string, unknown> | undefined;

    const [account, setAccount] = useState<Record<string, unknown> | null>(stateAccount ?? null);
    const [loading, setLoading] = useState(!stateAccount);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (account || !id) return;
        const controller = new AbortController();
        (async function load() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/game-accounts/${id}`, { signal: controller.signal });
                const data = await res.json();
                // possible shapes: { result: { ... } } or { result: { data: [...] } } or { data: {...} }
                let acc = null as any;
                if (data?.result && !Array.isArray(data.result)) acc = data.result;
                else if (data?.result?.data && Array.isArray(data.result.data)) acc = data.result.data[0];
                else if (data?.data && !Array.isArray(data.data)) acc = data.data;
                else acc = data?.result ?? data?.data ?? null;
                setAccount(acc);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [id, account]);

    function parseImages(a: Record<string, unknown> | null) {
        if (!a) return [] as string[];
        const images = a["images"] as unknown;
        if (!images) return [];
        if (Array.isArray(images)) return images.map(String);
        if (typeof images === "string") {
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed)) return parsed.map(String);
            } catch (e) {
                return [images];
            }
        }
        return [] as string[];
    }

    const imgs = parseImages(account);

    return (
    <div className="min-h-screen bg-[#0f1426] px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#00c8ff]">
                    🎮 Chi tiết tài khoản
                </h1>
                {/* <Link
                    to="/"
                    className="rounded-lg border border-[#00c8ff] px-4 py-1 text-[#00c8ff] transition hover:bg-[#00c8ff] hover:text-[#071028]"
                >
                    ⬅ Quay lại
                </Link> */}
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">Lỗi: {error}</p>
            ) : !account ? (
                <p>Không tìm thấy tài khoản.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Left: Thumbnail */}
                    <div className="md:col-span-1">
                        <div className="overflow-hidden rounded-xl border border-[#2a3150] bg-[#1a1f3a] shadow-lg">
                            {imgs.length > 0 ? (
                                <img
                                    src={imgs[0]}
                                    alt="thumb"
                                    className="h-64 w-full object-cover"
                                />
                            ) : (
                                <img
                                    src={String(account["thumb"] ?? "")}
                                    alt={String(account["accountName"] ?? "")}
                                    className="h-64 w-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="md:col-span-2 space-y-5">
                        <div className="rounded-xl border border-[#2a3150] bg-[#1a1f3a] p-5 shadow-lg">
                            <h2 className="text-xl font-bold text-[#00c8ff]">
                                {String(account["accountName"] ?? "")}
                            </h2>

                            <p className="mt-3 text-lg">
                                <strong className="text-[#b0b8d4]">Giá:</strong>{" "}
                                <span className="font-bold text-[#00c8ff]">
                                    {String(account["price"] ?? "0")} ₫
                                </span>
                            </p>

                            <p className="mt-3">
                                <strong className="text-[#b0b8d4]">Mật khẩu:</strong>{" "}
                                <span className="font-mono">{String(account["password"] ?? "")}</span>
                            </p>

                            {/* Details JSON */}
                            <div className="mt-4">
                                <strong className="text-[#b0b8d4]">Thông tin chi tiết:</strong>
                                <pre className="mt-2 rounded-lg bg-[#0f1426] p-4 text-sm text-[#d1d5db] whitespace-pre-wrap border border-[#2a3150]">
                                    {JSON.stringify(account["details"] ?? {}, null, 2)}
                                </pre>
                            </div>

                            {/* Extra images */}
                            {imgs.length > 1 && (
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    {imgs.map((u, i) => (
                                        <img
                                            key={i}
                                            src={u}
                                            alt={`img-${i}`}
                                            className="h-28 w-full rounded-lg object-cover border border-[#2a3150]"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

}
