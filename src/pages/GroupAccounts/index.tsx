import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatNumber } from "~/utils/functions";

// stable price ranges (values in VND)
const PRICE_RANGES: { key: string; label: string; min: number; max?: number }[] = [
    { key: "all", label: "Tất cả", min: 0 },
    { key: "0-100k", label: "0 - 100.000 ₫", min: 0, max: 100000 },
    { key: "100k-200k", label: "100.000 - 200.000 ₫", min: 100000, max: 200000 },
    { key: "200k-500k", label: "200.000 - 500.000 ₫", min: 200000, max: 500000 },
    { key: "500k-1m", label: "500.000 - 1.000.000 ₫", min: 500000, max: 1000000 },
    { key: "1m+", label: "Trên 1.000.000 ₫", min: 1000000 },
];

export default function GroupAccountsPage() {
    const { id } = useParams();
    const [accounts, setAccounts] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI filters
    const [search, setSearch] = useState("");
    const [, setPriceMax] = useState<number>(10000000);
    // priceRange key: 'all' or index key of ranges
    const [priceRange, setPriceRange] = useState<string>("all");

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:8000/game-accounts/group/${id}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                const list = data?.result?.data && Array.isArray(data.result.data) ? data.result.data : [];
                setAccounts(list as Array<Record<string, unknown>>);
                // compute max price
                const maxP = (list as Array<unknown>).reduce((m: number, it: any) => {
                    const p = Number(it?.price ?? 0) || 0;
                    return p > m ? p : m;
                }, 0);
                setPriceMax(maxP || 10000000);
                // keep selected priceRange; no slider to set here
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [id]);

    function parseImages(a: Record<string, unknown> | null) {
        if (!a) return [] as string[];
        const images = a["images"] as unknown;
        if (!images) return [] as string[];
        if (Array.isArray(images)) return images.map(String);
        if (typeof images === "string") {
            try {
                const parsed = JSON.parse(images);
                if (Array.isArray(parsed)) return parsed.map(String);
            } catch {
                return [images];
            }
        }
        return [] as string[];
    }

    function getImageUrl(src?: string) {
        if (!src) return "";
        try {
            if (typeof src !== "string") return "";
            const s = src.trim();
            if (!s) return "";
            if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
            // if API returns relative path like "images/foo.png", ensure it starts with '/'
            return "/" + s.replace(/^\/+/, "");
        } catch {
            return "";
        }
    }

    // use top-level PRICE_RANGES

    const filtered = useMemo(() => {
        const range = PRICE_RANGES.find((r) => r.key === priceRange) ?? PRICE_RANGES[0];
        return accounts.filter((a) => {
            const price = Number(a["price"] ?? 0) || 0;
            if (range.key !== "all") {
                if (typeof range.max === "number") {
                    if (price < range.min || price > range.max) return false;
                } else {
                    if (price < range.min) return false;
                }
            }
            const name = String(a["accountName"] ?? "").toLowerCase();
            if (search && !name.includes(search.toLowerCase())) return false;
            return true;
        });
    }, [accounts, priceRange, search]);

    function resetFilters() {
        setSearch("");
        setPriceRange("all");
    }

    return (
        <div>
            <div
                className="relative flex min-h-[70vh] flex-col overflow-hidden md:flex-row"
                style={{
                    backgroundImage: "url('/images/OIP.webp')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="pointer-events-none absolute inset-0 bg-black/50" />
                <aside className="ga-sidebar relative z-10 overflow-hidden bg-[#1a1f3a] md:h-screen">
                    <div className="mt-6 mb-4 ml-2 text-lg font-semibold text-[#00c8ff] uppercase">🎮 Bộ Lọc</div>

                    <div className="mb-4">
                        <label className="mt-10 mb-2 ml-2 block text-center text-[#b0b8d4] uppercase">Khoảng Giá</label>
                        <div>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full rounded-md border border-[#2a3150] bg-[#0f1426] px-3 py-2 text-white"
                            >
                                {PRICE_RANGES.map((r) => (
                                    <option key={r.key} value={r.key}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={resetFilters}
                        className="mt-2 w-full rounded border border-[#00c8ff] bg-transparent px-3 py-2 text-[#00c8ff]"
                    >
                        Đặt Lại Bộ Lọc
                    </button>
                </aside>
                <div className="relative z-10 flex flex-1 flex-col">
                    <header className="border-b border-[#2a3150] bg-[#1a1f3a] p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#00c8ff]">Tài Khoản Game</h2>
                            <div className="flex items-center gap-3">
                                <input
                                    placeholder="Tìm kiếm tài khoản..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-md border border-[#2a3150] bg-[#0f1426] px-3 py-2 text-white"
                                />
                                <div className="text-sm text-[#b0b8d4]">
                                    Hiển thị <strong className="text-white">{filtered.length}</strong> tài khoản
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto p-5" style={{ maxHeight: "calc(100vh - 80px)" }}>
                        {loading ? (
                            <p>Đang tải tài khoản...</p>
                        ) : error ? (
                            <p className="text-red-500">Lỗi: {error}</p>
                        ) : filtered.length === 0 ? (
                            <p>Không có tài khoản phù hợp.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {filtered.map((a, idx) => {
                                    const imgs = parseImages(a as Record<string, unknown>);
                                    const thumb = (() => {
                                        const t = String(a["thumb"] ?? "").trim();
                                        if (t) return t;
                                        if (imgs.length) return imgs[0];
                                        return "";
                                    })();
                                    const title = String(
                                        (a as Record<string, unknown>)["accountName"] ??
                                            (a as Record<string, unknown>)["title"] ??
                                            "Không tên",
                                    );
                                    const price = Number((a as Record<string, unknown>)["price"] ?? 0) || 0;
                                    return (
                                        <div
                                            key={String((a as Record<string, unknown>).id ?? `no-id-${idx}`)}
                                            className="transform overflow-hidden rounded-lg border border-[#2a3150] bg-[#1a1f3a] transition hover:-translate-y-1 hover:border-[#00c8ff] hover:shadow-lg"
                                        >
                                            <div className="relative flex h-40 items-center justify-center overflow-hidden from-[#1a1f3a] to-[#252d4a]">
                                                <img
                                                    src={getImageUrl(thumb) || "/images/OIP.webp"}
                                                    alt={title}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        if (!img || typeof img.src !== "string") return;
                                                        if (img.src.includes("default-card.png")) return;
                                                        img.src = "/images/default-card.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="p-3">
                                                <div className="truncate text-sm font-bold text-white" title={title}>
                                                    {title}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-[#2a3150] px-3 py-2">
                                                <Link
                                                    to={`/accounts/${String((a as Record<string, unknown>).id)}`}
                                                    state={{ account: a }}
                                                    className="rounded-md bg-[#00c8ff] px-3 py-1 font-bold text-[#071028]"
                                                >
                                                    Chi tiết
                                                </Link>
                                                <div className="font-extrabold text-[#00c8ff]">
                                                    {formatNumber(price)} ₫
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
