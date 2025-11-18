import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Dữ liệu account game (dùng cho admin)
const gameAccounts = [
  { id: 1, game: "LOL", username: "Player1", price: 100000 },
  { id: 2, game: "PUBG", username: "Player2", price: 150000 },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const navigate =  useNavigate()

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
    <div className="container mx-auto my-8 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-5">
        <div className="flex flex-col items-center mb-6">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="h-24 w-24 rounded-full object-cover mb-2 shadow-sm"
          />
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <span className="text-gray-500 text-sm">{userData.status}</span>
        </div>
        <ul className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "hover:bg-blue-100 hover:text-blue-600 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <section className="w-full lg:w-3/4 bg-white rounded-lg shadow-md p-6 transition-all duration-300">
        {/* User Info */}
        {activeTab === "info" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-3">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <h3 className="text-2xl font-semibold mb-3">Lịch sử mua nick</h3>
            <p>Chưa có dữ liệu lịch sử mua.</p>
          </div>
        )}

        {/* Deposit */}
        {activeTab === "deposit" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-3">Nạp tiền</h3>
            <p>Chọn phương thức thanh toán và số tiền muốn nạp:</p>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button className="flex-1 bg-green-500 text-white rounded-lg py-3 font-semibold hover:bg-green-600 transition">
                Chuyển khoản ngân hàng
              </button>
              <button className="flex-1 bg-blue-500 text-white rounded-lg py-3 font-semibold hover:bg-blue-600 transition">
                Ví điện tử
              </button>
            </div>
          </div>
        )}

        {/* Admin: Quản lý user */}
        {activeTab === "users" && userData.role === "admin" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-3">Quản lý user</h3>
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
                    <td className="border px-4 py-2 flex gap-2">
                      <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Sửa</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => navigate("/admin/add-user")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursoi-pointer"
            >
              Thêm user mới
            </button>
          </div>
        )}

        {/* Admin: Quản lý account game */}
        {activeTab === "accounts" && userData.role === "admin" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-3">Quản lý account game</h3>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Game</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Giá</th>
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {gameAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="border px-4 py-2">{acc.id}</td>
                    <td className="border px-4 py-2">{acc.game}</td>
                    <td className="border px-4 py-2">{acc.username}</td>
                    <td className="border px-4 py-2">{acc.price}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Sửa</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             <button
              onClick={() => navigate("/admin/add-account")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursoi-pointer"
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
