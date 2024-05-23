import React from 'react';
import { useAuth } from '../context/AuthContext';
import BookTable from '../components/BooksTable';



const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className=''>
      <header className="p-4 bg-black text-white flex justify-between  rounded-lg  border border-gray-100 ">
        <h1 className="text-2xl">Dashboard</h1>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>
      <main className="p-4">
        <BookTable />
      </main>
    </div>
  );
};

export default Dashboard;
