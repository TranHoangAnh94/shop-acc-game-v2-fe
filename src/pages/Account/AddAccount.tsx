const AddAccountPage = () => {
  return (
    <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Thêm Account Game</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Game</p>
          <input className="border w-full p-2 rounded" placeholder="Nhập tên game" />
        </div>

        <div>
          <p className="text-gray-600">Username</p>
          <input className="border w-full p-2 rounded" placeholder="Nhập username" />
        </div>

        <div>
          <p className="text-gray-600">Mật khẩu account</p>
          <input className="border w-full p-2 rounded" placeholder="Nhập password" />
        </div>

        <div>
          <p className="text-gray-600">Giá bán</p>
          <input type="number" className="border w-full p-2 rounded" placeholder="Nhập giá" />
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Thêm account
        </button>
      </div>
    </div>
  );
};

export default AddAccountPage;
