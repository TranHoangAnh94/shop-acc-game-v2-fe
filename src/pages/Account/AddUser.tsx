const AddUserPage = () => {
  return (
    <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Thêm User Mới</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Tên</p>
          <input className="border w-full p-2 rounded" placeholder="Nhập tên" />
        </div>

        <div>
          <p className="text-gray-600">Email</p>
          <input className="border w-full p-2 rounded" placeholder="Nhập email" />
        </div>

        <div>
          <p className="text-gray-600">Mật khẩu</p>
          <input type="password" className="border w-full p-2 rounded" placeholder="Nhập mật khẩu" />
        </div>

        <div>
          <p className="text-gray-600">Role</p>
          <select className="border w-full p-2 rounded">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Thêm user
        </button>
      </div>
    </div>
  );
};

export default AddUserPage;
