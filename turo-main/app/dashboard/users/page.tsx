'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/list-users');
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de usuarios</h1>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border-b">ID</th>
              <th className="text-left p-2 border-b">Email</th>
              <th className="text-left p-2 border-b">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{user.id}</td>
                <td className="p-2 border-b">{user.email}</td>
                <td className="p-2 border-b capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}