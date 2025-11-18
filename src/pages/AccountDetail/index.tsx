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
        <div className="px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Chi tiết tài khoản</h1>
                <Link to="/" className="text-primary">
                    Quay lại
                </Link>
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-600">Lỗi: {error}</p>
            ) : !account ? (
                <p>Không tìm thấy tài khoản.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        {imgs.length > 0 ? (
                            <img src={imgs[0]} alt="thumb" className="w-full object-cover" />
                        ) : (
                            <img
                                src={String(account["thumb"] ?? "")}
                                alt={String(account["accountName"] ?? "")}
                                className="w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold">{String(account["accountName"] ?? "")}</h2>
                        <p className="mt-2">
                            <strong>Giá:</strong> {String(account["price"] ?? "0")}
                        </p>
                        <p className="mt-2">
                            <strong>Mật khẩu:</strong> {String(account["password"] ?? "")}
                        </p>
                        <div className="mt-4">
                            <strong>Chi tiết:</strong>
                            <pre className="mt-2 rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap">
                                {JSON.stringify(account["details"] ?? {}, null, 2)}
                            </pre>
                        </div>
                        {imgs.length > 1 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {imgs.map((u, i) => (
                                    <img key={i} src={u} alt={`img-${i}`} className="h-24 w-full object-cover" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
