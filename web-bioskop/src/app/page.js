import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-600">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">CinemaBook</div>
        <div className="flex items-center space-x-8">
          <a href="#" className="text-white hover:text-gray-200">Home</a>
          <a href="#" className="text-white hover:text-gray-200">Movies</a>
          <a href="#" className="text-white hover:text-gray-200">Theaters</a>
          <a href="#" className="text-white border-2 border-white rounded-full px-6 py-2 hover:bg-white hover:text-blue-800 transition duration-300">Book Now</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center text-center">
        <h1 className="text-white text-6xl font-bold mb-8">
          Experience Movies Like Never Before
        </h1>
        <p className="text-white text-xl mb-12 max-w-3xl">
          Sistem pemesanan tiket bioskop modern dengan pengalaman yang mudah dan menyenangkan
        </p>
        <a 
          href="#" 
          className="flex items-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-blue-800 transition duration-300"
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5C5.89543 5 5 5.89543 5 7V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V7C19 5.89543 18.1046 5 17 5H7ZM15.5 10C15.5 11.933 13.933 13.5 12 13.5C10.067 13.5 8.5 11.933 8.5 10C8.5 8.067 10.067 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10Z"/>
          </svg>
          Browse Movies Now
        </a>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-blue-800 bg-opacity-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="text-white text-4xl mb-4">📅</div>
            <h3 className="text-white text-2xl font-bold mb-4">Jadwal Fleksibel</h3>
            <p className="text-white">Pilih jadwal yang sesuai dengan waktu Anda</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-blue-800 bg-opacity-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="text-white text-4xl mb-4">📍</div>
            <h3 className="text-white text-2xl font-bold mb-4">Pilih Kursi</h3>
            <p className="text-white">Pilih kursi favorit Anda dengan mudah</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-blue-800 bg-opacity-50 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="text-white text-4xl mb-4">👤</div>
            <h3 className="text-white text-2xl font-bold mb-4">Booking Mudah</h3>
            <p className="text-white">Proses pemesanan yang cepat dan aman</p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="container mx-auto px-4 py-10 mb-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-t-lg flex">
            <button className="flex-1 py-3 font-medium">Login</button>
            <button className="flex-1 py-3 font-medium text-gray-500">Daftar</button>
          </div>
          
          {/* Login Form */}
          <div className="bg-blue-800 bg-opacity-60 rounded-b-lg p-6">
            <h2 className="text-white text-2xl font-bold mb-2">Masuk ke Akun</h2>
            <p className="text-white text-sm mb-6">Masukkan username dan password Anda</p>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Username</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-lg bg-blue-700 bg-opacity-50 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-3 rounded-lg bg-blue-700 bg-opacity-50 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
              />
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
              Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
