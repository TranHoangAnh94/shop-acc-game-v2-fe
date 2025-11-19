import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/context/AuthContext";
import { formatNumber } from "~/utils/functions";

// Dữ liệu user login
const userData = {
    id: 1,
    name: "Nguyen Van A",
    password: 123456,
    phone: "0812665001",
    email: "dragonnight1701@gmail.com",
    createdAt: "16-11-2025",
    status: "Đang hoạt động",
    balance: "100000",
    role: "admin",
    avatar: "/images/default-avatar.png",
};

// Dữ liệu mẫu các user khác (dùng cho admin)
const usersList = [
    { id: 1, name: "Nguyen Van A", email: "a@gmail.com", role: "member" },
    { id: 2, name: "Tran Thi B", email: "b@gmail.com", role: "member" },
    { id: 3, name: "Admin", email: "admin@gmail.com", role: "admin" },
];

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("info");
    const navigate = useNavigate();
    const { user } = useAuth();

    // States for purchase history
    const [purchaseHistory, setPurchaseHistory] = useState<Array<Record<string, unknown>>>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    // States for admin account management
    const [accounts, setAccounts] = useState<Array<Record<string, unknown>>>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);
    const [accountsError, setAccountsError] = useState<string | null>(null);

    // Fetch purchase history when history tab is active
    useEffect(() => {
        if (activeTab === "history" && user?.access_token) {
            fetchPurchaseHistory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    // Fetch accounts for admin when accounts tab is active
    useEffect(() => {
        if (activeTab === "accounts" && user?.access_token && userData.role === "admin") {
            fetchAccounts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    const fetchPurchaseHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryError(null);

            const response = await fetch("http://localhost:8000/game-accounts/my-purchased", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const items =
                    data?.result?.data && Array.isArray(data.result.data)
                        ? data.result.data
                        : Array.isArray(data.result)
                          ? data.result
                          : [];
                setPurchaseHistory(items);
            } else {
                setHistoryError(data.message || "Không thể tải lịch sử mua");
            }
        } catch (error) {
            setHistoryError(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingHistory(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            setLoadingAccounts(true);
            setAccountsError(null);

            const response = await fetch("http://localhost:8000/game-accounts", {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const items =
                    data?.result?.data && Array.isArray(data.result.data)
                        ? data.result.data
                        : Array.isArray(data.result)
                          ? data.result
                          : [];
                setAccounts(items);
            } else {
                setAccountsError(data.message || "Không thể tải danh sách account");
            }
        } catch (error) {
            setAccountsError(error instanceof Error ? error.message : "Có lỗi xảy ra");
        } finally {
            setLoadingAccounts(false);
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa account này?")) return;

        try {
            const response = await fetch(`http://localhost:8000/game-accounts/account/${accountId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Xóa account thành công!");
                fetchAccounts();
            } else {
                alert(data.message || "Có lỗi xảy ra khi xóa account");
            }
        } catch (error) {
            alert("Có lỗi xảy ra: " + (error instanceof Error ? error.message : String(error)));
        }
    };

    // Tabs cho user và admin
    const userTabs = [
        { id: "info", label: "Thông tin tài khoản" },
        { id: "history", label: "Lịch sử mua nick" },
        { id: "deposit", label: "Nạp tiền" },
    ];

    const adminTabs = [
        { id: "users", label: "Quản lý user" },
        { id: "accounts", label: "Quản lý account game" },
    ];

    const tabs = userData.role === "admin" ? [...userTabs, ...adminTabs] : userTabs;

    return (
        <div className="container mx-auto my-8 flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full rounded-lg bg-white p-5 shadow-md lg:w-1/4">
                <div className="mb-6 flex flex-col items-center">
                    <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="mb-2 h-24 w-24 rounded-full object-cover shadow-sm"
                    />
                    <h2 className="text-xl font-semibold">{userData.name}</h2>
                    <span className="text-sm text-gray-500">{userData.status}</span>
                </div>
                <ul className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full cursor-pointer rounded-lg px-4 py-2 text-left transition-colors duration-300 ${
                                    activeTab === tab.id
                                        ? "bg-blue-500 font-semibold text-white shadow"
                                        : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Content */}
            <section className="w-full rounded-lg bg-white p-6 shadow-md transition-all duration-300 lg:w-3/4">
                {/* User Info */}
                {activeTab === "info" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-gray-500">Tên đăng nhập</p>
                                <p className="font-medium">{userData.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Password</p>
                                <p className="font-medium">{userData.password}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium">{userData.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Số dư</p>
                                <p className="font-medium">{userData.balance}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{userData.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Role</p>
                                <p className="font-medium">{userData.role}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Ngày tạo tài khoản</p>
                                <p className="font-medium">{userData.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trạng thái</p>
                                <p className="font-medium">{userData.status}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Lịch sử mua nick</h3>

                        {loadingHistory ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : historyError ? (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <p>{historyError}</p>
                            </div>
                        ) : purchaseHistory.length === 0 ? (
                            <div className="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
                                <p>Chưa có lịch sử mua nick nào.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-left">Tên tài khoản</th>
                                            <th className="border px-4 py-2 text-left">Giá</th>
                                            <th className="border px-4 py-2 text-left">Ngày mua</th>
                                            <th className="border px-4 py-2 text-left">Trạng thái</th>
                                            <th className="border px-4 py-2 text-left">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseHistory.map((item, index) => (
                                            <tr key={String(item.id ?? index)} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2">
                                                    <span className="font-medium">
                                                        {String(item.name ?? "Không có tên")}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span className="font-semibold text-blue-600">
                                                        {formatNumber(Number(item.price ?? 0))} ₫
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {item.purchasedAt
                                                        ? new Date(String(item.purchasedAt)).toLocaleDateString("vi-VN")
                                                        : item.createdAt
                                                          ? new Date(String(item.createdAt)).toLocaleDateString("vi-VN")
                                                          : "-"}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                                            Number(item.status) === 1
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {Number(item.status) === 1 ? "Đã mua" : "Đã bán"}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        onClick={() => navigate(`/accounts/${String(item.id)}`)}
                                                        className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Deposit */}
                {activeTab === "deposit" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Nạp tiền</h3>
                        <p>Chọn phương thức thanh toán và số tiền muốn nạp:</p>
                        <div className="mt-4 flex flex-col gap-4 md:flex-row">
                            <button className="flex-1 rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600">
                                Chuyển khoản ngân hàng
                            </button>
                            <button className="flex-1 rounded-lg bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600">
                                Ví điện tử
                            </button>
                        </div>
                    </div>
                )}

                {/* Admin: Quản lý user */}
                {activeTab === "users" && userData.role === "admin" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Quản lý user</h3>
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Tên</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Role</th>
                                    <th className="border px-4 py-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u.id}>
                                        <td className="border px-4 py-2">{u.id}</td>
                                        <td className="border px-4 py-2">{u.name}</td>
                                        <td className="border px-4 py-2">{u.email}</td>
                                        <td className="border px-4 py-2">{u.role}</td>
                                        <td className="flex gap-2 border px-4 py-2">
                                            <button className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500">
                                                Sửa
                                            </button>
                                            <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={() => navigate("/admin/add-user")}
                            className="cursoi-pointer mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                            Thêm user mới
                        </button>
                    </div>
                )}

                {/* Admin: Quản lý account game */}
                {activeTab === "accounts" && userData.role === "admin" && (
                    <div className="space-y-4">
                        <h3 className="mb-3 text-2xl font-semibold">Quản lý account game</h3>

                        {loadingAccounts ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : accountsError ? (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <p>{accountsError}</p>
                            </div>
                        ) : accounts.length === 0 ? (
                            <div className="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
                                <p>Chưa có account nào.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2 text-left">ID</th>
                                            <th className="border px-4 py-2 text-left">Hình ảnh</th>
                                            <th className="border px-4 py-2 text-left">Tên</th>
                                            <th className="border px-4 py-2 text-left">Giá</th>
                                            <th className="border px-4 py-2 text-left">Trạng thái</th>
                                            <th className="border px-4 py-2 text-left">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((acc, index) => (
                                            <tr key={String(acc.id ?? index)} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2">{String(acc.id ?? "-")}</td>
                                                <td className="border px-4 py-2">
                                                    {acc.thumb && typeof acc.thumb === "string" ? (
                                                        <img
                                                            src={acc.thumb}
                                                            alt="thumb"
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Không có ảnh</span>
                                                    )}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span className="font-medium">
                                                        {String(acc.name ?? "Không có tên")}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span className="font-semibold text-blue-600">
                                                        {formatNumber(Number(acc.price ?? 0))} ₫
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                                            Number(acc.status) === 0
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {Number(acc.status) === 0 ? "Còn hàng" : "Đã bán"}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/admin/edit-account/${String(acc.id)}`)
                                                            }
                                                            className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAccount(String(acc.id))}
                                                            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            onClick={() => navigate("/admin/add-account")}
                            className="mt-4 cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                            Thêm account mới
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AccountPage;
