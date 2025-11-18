import { useEffect, useState } from "react";
import MarqueeData from "~/components/MarqueeData";
import Hero from "./Hero";
import Categories from "./Categories";
import ModalPopup from "~/components/ModalPopup";
import type { CategoryItemType } from "~/types/Categories.type";
import { histories } from "./fakerData";

export default function HomePage() {
    const [categories, setCategories] = useState<CategoryItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            <ModalPopup />
        </>
    );
}
