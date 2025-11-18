import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HeadLine from "~/components/Headline";
import { TiStar } from "react-icons/ti";
// import CategoryStats from "../Home/CategoryStats";
// import { FaCubes, FaShoppingCart } from "react-icons/fa";
// import { formatNumber } from "../../utils/functions";

export default function CategoryGroupsPage() {
    const { id } = useParams();
    const [groups, setGroups] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:8000/game-groups/category/${id}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                const items = Array.isArray(data.result) ? data.result : [];
                setGroups(items as Array<Record<string, unknown>>);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setGroups([]);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [id]);

    return (
        <div className="px-4 py-6">
            <HeadLine title={`Nhóm game`} url={id ? `/categories/${id}/groups` : ""} />
            {loading ? (
                <p className="p-4 text-center">Đang tải nhóm game...</p>
            ) : error ? (
                <p className="p-4 text-center text-red-600">Lỗi: {error}</p>
            ) : groups.length === 0 ? (
                <p className="p-4 text-center">Không tìm thấy nhóm game cho danh mục này.</p>
            ) : (
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-6 md:grid-cols-3 md:gap-x-2.5 lg:grid-cols-4">
                    {groups.map((g, key) => {
                        const idVal = String(g.id ?? "");
                        const title = String(g.title ?? "");
                        const thumbnail = String(g.thumbnail ?? "");
                        return (
                            <div
                                key={`${title}-${idVal}`}
                                className="border-primary relative flex flex-col overflow-hidden rounded-lg border shadow-[0_10px_20px_rgba(0,0,0,0.05)] duration-200 hover:transform-[translateY(-4px)] hover:bg-[#e8f0ff] hover:shadow-[0_10px_25px_rgba(10,106,255,0.12)]"
                            >
                                {key <= 2 && (
                                    <span className="game-item_top hidden md:block">
                                        <TiStar className="mx-auto text-lg" />{" "}
                                        <span className="block text-xs">Top {key + 1}</span>
                                    </span>
                                )}

                                <Link to={`/group/${String(g.slug ?? idVal)}`} className="block">
                                    <img
                                        src={thumbnail}
                                        className="aspect-video w-full object-cover transition-all duration-200"
                                        alt={title}
                                    />
                                    <div className="flex h-full flex-col items-center justify-between bg-white px-2 py-3 text-xs md:mt-0 md:px-2 md:py-5 md:text-sm">
                                        <div className="ht-flex-center flex-col gap-2">
                                            <h2 className="text-center text-sm font-bold md:line-clamp-2 md:text-base md:hover:line-clamp-none">
                                                {title}
                                            </h2>
                                            <div className="ht-flex-center text-gray-dark flex-col gap-2 lg:flex-row"></div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex justify-center p-3">
                                    <Link to={`/group/${idVal}/accounts`} className="block">
                                        <img
                                            src="/images/icons/ViewAllIcon.gif"
                                            alt="Xem tất cả"
                                            className="mt-2 w-[137px] object-cover"
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
