import AdminSidebar from '../../components/AdminSidebar';

const AdminUsers = () => {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFF5E6' }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#704214' }}>USERS</h1>
        <div className="bg-white rounded-lg shadow p-6 border-2" style={{ borderColor: '#704214' }}>
          <p style={{ color: '#704214' }}>User management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
