import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HeadLine from "~/components/Headline";

export default function GroupAccountsPage() {
    const { id } = useParams();
    const [accounts, setAccounts] = useState<Array<Record<string, unknown>>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // modal removed: navigation to detail page will be used instead

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
                setAccounts(list);
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

    return (
        <div className="px-4 py-6">
            <HeadLine title={`Tài khoản nhóm`} url="" />

            {loading ? (
                <p className="p-4 text-center">Đang tải tài khoản...</p>
            ) : error ? (
                <p className="p-4 text-center text-red-600">Lỗi: {error}</p>
            ) : accounts.length === 0 ? (
                <p className="p-4 text-center">Không có tài khoản cho nhóm này.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {accounts.map((a) => (
                        <div key={String(a.id)} className="flex flex-col rounded-lg border bg-white p-2 shadow-sm">
                            <img
                                src={String(a.thumb ?? (Array.isArray(a.images) ? a.images[0] : ""))}
                                alt={String(a.accountName ?? "")}
                                className="mb-2 h-40 w-full object-cover"
                            />
                            <div className="text-sm font-semibold">{String(a.accountName ?? "")}</div>
                            <div className="mt-2 text-gray-600">
                                Giá: <span className="font-bold text-red-600">{String(a.price ?? "0")}</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <Link
                                    to={`/accounts/${String(a.id)}`}
                                    state={{ account: a }}
                                    className="bg-primary flex-1 rounded px-3 py-2 text-center text-white hover:opacity-90"
                                >
                                    Xem chi tiết
                                </Link>
                                <button
                                    type="button"
                                    className="flex-1 rounded border px-3 py-2 text-sm"
                                    onClick={() => alert("Chức năng Mua chưa được cài đặt")}
                                >
                                    Mua
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* modal removed; details page is used instead */}
        </div>
    );
}
