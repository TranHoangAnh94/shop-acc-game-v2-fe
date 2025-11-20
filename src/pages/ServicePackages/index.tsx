import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatNumber } from "~/utils/functions";
import HeadLine from "~/components/Headline";
import { TiStar } from "react-icons/ti";

// stable price ranges (values in VND)
const PRICE_RANGES: { key: string; label: string; min: number; max?: number }[] = [
    { key: "all", label: "Tất cả", min: 0 },
    { key: "0-100k", label: "0 - 100.000 ₫", min: 0, max: 100000 },
    { key: "100k-200k", label: "100.000 - 200.000 ₫", min: 100000, max: 200000 },
    { key: "200k-500k", label: "200.000 - 500.000 ₫", min: 200000, max: 500000 },
    { key: "500k-1m", label: "500.000 - 1.000.000 ₫", min: 500000, max: 1000000 },
    { key: "1m+", label: "Trên 1.000.000 ₫", min: 1000000 },
];

export default function ServicePackagesPage() {
    const { serviceId } = useParams();
    const [packages, setPackages] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI filters
    const [search, setSearch] = useState("");
    const [, setPriceMax] = useState<number>(10000000);
    // priceRange key: 'all' or index key of ranges
    const [priceRange, setPriceRange] = useState<string>("all");

    useEffect(() => {
        if (!serviceId) return;
        const controller = new AbortController();
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:8000/service-packages/game-services/${serviceId}`, {
                    signal: controller.signal,
                });
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
                
                // compute max price
                const maxP = list.reduce((m: number, it: Record<string, unknown>) => {
                    const p = Number(it?.price ?? 0) || 0;
                    return p > m ? p : m;
                }, 0);
                setPriceMax(maxP || 10000000);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setPackages([]);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [serviceId]);

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

    const filtered = useMemo(() => {
        const range = PRICE_RANGES.find((r) => r.key === priceRange) ?? PRICE_RANGES[0];
        return packages.filter((pkg) => {
            const price = Number(pkg["price"] ?? 0) || 0;
            if (range.key !== "all") {
                if (typeof range.max === "number") {
                    if (price < range.min || price > range.max) return false;
                } else {
                    if (price < range.min) return false;
                }
            }
            const name = String(pkg["name"] ?? pkg["title"] ?? "").toLowerCase();
            if (search && !name.includes(search.toLowerCase())) return false;
            return true;
        });
    }, [packages, priceRange, search]);

    function resetFilters() {
        setSearch("");
        setPriceRange("all");
    }

    return (
        <div className="px-4 py-6">
            <HeadLine title="Gói Dịch Vụ Cày Thuê" url="" type="service" />

            {/* Filter Section */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-semibold">Khoảng Giá:</label>
                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {PRICE_RANGES.map((r) => (
                            <option key={r.key} value={r.key}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={resetFilters}
                        className="rounded-lg border border-blue-500 bg-transparent px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50"
                    >
                        Đặt Lại
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        placeholder="Tìm kiếm gói dịch vụ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-sm text-gray-600">
                        Hiển thị <strong className="text-blue-600">{filtered.length}</strong> gói dịch vụ
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="p-4 text-center">Đang tải gói dịch vụ...</p>
            ) : error ? (
                <p className="p-4 text-center text-red-600">Lỗi: {error}</p>
            ) : filtered.length === 0 ? (
                <p className="p-4 text-center">Không có gói dịch vụ phù hợp.</p>
            ) : (
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-6 md:grid-cols-3 md:gap-x-2.5 lg:grid-cols-4">
                    {filtered.map((pkg, idx) => {
                        const imgs = parseImages(pkg as Record<string, unknown>);
                        const thumb = (() => {
                            const t = String(pkg["thumb"] ?? pkg["thumbnail"] ?? "").trim();
                            if (t) return t;
                            if (imgs.length) return imgs[0];
                            return "";
                        })();
                        const title = String(pkg["name"] ?? pkg["title"] ?? "Không có tên");
                        const price = Number(pkg["price"] ?? 0) || 0;
                        const packageId = String(pkg.id ?? "");
                        const description = String(pkg["description"] ?? "");

                        return (
                            <div
                                key={packageId || `no-id-${idx}`}
                                className="border-primary relative flex flex-col overflow-hidden rounded-lg border shadow-[0_10px_20px_rgba(0,0,0,0.05)] duration-200 hover:transform-[translateY(-4px)] hover:bg-[#e8f0ff] hover:shadow-[0_10px_25px_rgba(10,106,255,0.12)]"
                            >
                                {idx <= 2 && (
                                    <span className="game-item_top hidden md:block">
                                        <TiStar className="mx-auto text-lg" />
                                        <span className="block text-xs">Top {idx + 1}</span>
                                    </span>
                                )}

                                <Link to={`/service-packages/${packageId}`} state={{ package: pkg }} className="block">
                                    <img
                                        src={getImageUrl(thumb) || "/images/OIP.webp"}
                                        alt={title}
                                        className="aspect-video w-full object-cover transition-all duration-200"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            if (!img || typeof img.src !== "string") return;
                                            if (img.src.includes("default-card.png")) return;
                                            img.src = "/images/default-card.png";
                                        }}
                                    />
                                    <div className="flex h-full flex-col items-center justify-between bg-white px-2 py-3 text-xs md:mt-0 md:px-2 md:py-5 md:text-sm">
                                        <div className="ht-flex-center flex-col gap-2">
                                            <h2 className="text-center text-sm font-bold md:line-clamp-2 md:text-base md:hover:line-clamp-none">
                                                {title}
                                            </h2>
                                            {description && (
                                                <p className="line-clamp-2 text-center text-xs text-gray-600">
                                                    {description}
                                                </p>
                                            )}
                                            <div className="mt-2 font-extrabold text-blue-600">
                                                {formatNumber(price)} ₫
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex justify-center border-t border-gray-100 p-3">
                                    <Link
                                        to={`/service-packages/${packageId}`}
                                        state={{ package: pkg }}
                                        className="block"
                                    >
                                        <img
                                            src="/images/icons/ViewAllIcon.gif"
                                            alt="Xem chi tiết"
                                            className="w-[137px] object-cover"
                                        />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
