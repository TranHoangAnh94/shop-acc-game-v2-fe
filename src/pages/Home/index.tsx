import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TiStar } from "react-icons/ti";
import MarqueeData from "~/components/MarqueeData";
import Hero from "./Hero";
import Categories from "./Categories";
import ModalPopup from "~/components/ModalPopup";
import HeadLine from "~/components/Headline";
import type { CategoryItemType } from "~/types/Categories.type";
import { histories } from "./fakerData";

export default function HomePage() {
    const [categories, setCategories] = useState<CategoryItemType[]>([]);
    const [services, setServices] = useState<CategoryItemType[]>([]);
    const [searchService, setSearchService] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServices, setErrorServices] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("http://localhost:8000/game-categories", {
                    signal: controller.signal,
                });
                const data = await res.json();
                // The API returns { message, result: [...] }
                const items = Array.isArray(data.result) ? (data.result as Array<Record<string, unknown>>) : [];
                const mapped: CategoryItemType[] = items.map((it) => {
                    const id = String(it["id"] ?? "");
                    const name = String(it["name"] ?? "");
                    const image = String(it["thumbnail"] ?? it["image"] ?? "");
                    const sold = typeof it["sold"] === "number" ? (it["sold"] as number) : 0;
                    const remaining = typeof it["remaining"] === "number" ? (it["remaining"] as number) : 0;
                    return {
                        id,
                        name,
                        image,
                        sold,
                        remaining,
                        url: `/categories/${id}`,
                    };
                });
                setCategories(mapped);
            } catch (err) {
                // Surface error to the UI for debugging
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Failed to load categories:", err);
                setError(msg);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        async function loadServices() {
            try {
                setLoadingServices(true);
                setErrorServices(null);
                const res = await fetch("http://localhost:8000/game-services", {
                    signal: controller.signal,
                });
                const data = await res.json();
                // Parse services data similar to categories
                const items = Array.isArray(data.result) ? (data.result as Array<Record<string, unknown>>) : [];
                const mapped: CategoryItemType[] = items.map((it) => {
                    const id = String(it["id"] ?? "");
                    const name = String(it["name"] ?? "");
                    const image = String(it["thumbnail"] ?? it["image"] ?? "");
                    const sold = typeof it["sold"] === "number" ? (it["sold"] as number) : 0;
                    const remaining = typeof it["remaining"] === "number" ? (it["remaining"] as number) : 0;
                    return {
                        id,
                        name,
                        image,
                        sold,
                        remaining,
                        url: `/dich-vu/${id}`,
                    };
                });
                setServices(mapped);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Failed to load services:", err);
                setErrorServices(msg);
                setServices([]);
            } finally {
                setLoadingServices(false);
            }
        }
        loadServices();
        return () => controller.abort();
    }, []);

    // Filter services based on search
    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchService.toLowerCase()),
    );

    return (
        <>
            <Hero />
            <MarqueeData histories={histories} />

            {loading ? (
                <p className="p-4 text-center">Đang tải danh mục...</p>
            ) : error ? (
                <p className="p-4 text-center text-red-600">Lỗi tải danh mục: {error}</p>
            ) : categories.length === 0 ? (
                <div className="p-4 text-center">
                    <p>Không có danh mục để hiển thị.</p>
                    <p className="text-xs text-gray-500">Kiểm tra API {`http://localhost:8000/game-categories`}</p>
                </div>
            ) : (
                <Categories
                    nameCategory="Danh Mục Game"
                    categories={categories}
                    type="group"
                    url="/group"
                    urlIconImage="/images/icons/ViewAllIcon.gif"
                />
            )}

            {/* Danh mục Cày thuê */}
            {loadingServices ? (
                <p className="p-4 text-center">Đang tải dịch vụ cày thuê...</p>
            ) : errorServices ? (
                <p className="p-4 text-center text-red-600">Lỗi tải dịch vụ: {errorServices}</p>
            ) : services.length === 0 ? (
                <div className="p-4 text-center">
                    <p>Không có dịch vụ cày thuê.</p>
                </div>
            ) : (
                <div className="mb-20">
                    <HeadLine title="Dịch Vụ Cày Thuê" url="/services" type="service" />

                    {/* Search Box */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={searchService}
                            onChange={(e) => setSearchService(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none md:text-base"
                        />
                    </div>

                    {/* Services Grid */}
                    {filteredServices.length === 0 ? (
                        <p className="p-4 text-center text-gray-500">Không tìm thấy dịch vụ nào phù hợp.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-1.5 gap-y-6 md:grid-cols-3 md:gap-x-2.5 lg:grid-cols-4">
                            {filteredServices.map((service, key) => (
                                <Link
                                    to={service.url}
                                    key={`${service.name}-${service.id}`}
                                    className="border-primary relative flex flex-col overflow-hidden rounded-lg border shadow-[0_10px_20px_rgba(0,0,0,0.05)] duration-200 hover:transform-[translateY(-4px)] hover:bg-[#e8f0ff] hover:shadow-[0_10px_25px_rgba(10,106,255,0.12)]"
                                >
                                    {key <= 2 && (
                                        <span className="game-item_top hidden md:block">
                                            <TiStar className="mx-auto text-lg" />{" "}
                                            <span className="block text-xs">Top {key + 1}</span>
                                        </span>
                                    )}
                                    <img
                                        src={service.image}
                                        className="aspect-video w-full object-cover transition-all duration-200"
                                        alt={service.name}
                                    />
                                    <div className="flex h-full flex-col items-center justify-between bg-white px-2 py-3 text-xs md:mt-0 md:px-2 md:py-5 md:text-sm">
                                        <div className="ht-flex-center flex-col gap-2">
                                            <h2 className="text-center text-sm font-bold md:line-clamp-2 md:text-base md:hover:line-clamp-none">
                                                {service.name}
                                            </h2>
                                        </div>
                                        <img
                                            src="/images/icons/ViewAllIcon.gif"
                                            alt="Xem chi tiết"
                                            className="mt-2 w-[137px] object-cover"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <ModalPopup />
        </>
    );
}
