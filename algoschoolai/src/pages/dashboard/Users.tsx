import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUsers, setEditUsers] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveMsg(data.error || 'Error al eliminar usuario');
        setSaving(false);
        return;
      }
      setUsers(users => users.filter(u => u.id !== userId));
      setSaveMsg('Usuario eliminado correctamente');
    } catch (err) {
      setSaveMsg('Error al eliminar usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.allUsers', 'Todos los Usuarios')}</h1>
      <div className="mb-4 flex items-center gap-4">
        <Button size="lg" variant="primary" disabled={saving || Object.keys(editUsers).length === 0} onClick={async () => {
          setSaving(true);
          setSaveMsg(null);
          try {
            const token = localStorage.getItem('token');
            const updates = Object.entries(editUsers);
            for (const [userId, changes] of updates) {
              const c = changes as Record<string, any>;
              // Solo permitir status y notes
              const allowed: any = {};
              if ('status' in c) allowed.status = c.status;
              if ('notes' in c) allowed.notes = c.notes;
              await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(allowed)
              });
              setUsers(users => users.map(u => u.id === userId ? { ...u, ...allowed } : u));
            }
            setEditUsers({});
            setSaveMsg('Cambios guardados correctamente');
          } catch (err) {
            setSaveMsg('Error al guardar cambios');
          } finally {
            setSaving(false);
          }
        }}>Guardar cambios</Button>
        {saveMsg && <span className={saveMsg.includes('Error') ? 'text-red-600' : 'text-green-600'}>{saveMsg}</span>}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Notas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha de Registro</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Eliminar</th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-500">{t('loading', 'Cargando...')}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-500">{t('adminDashboard.noUsers', 'No hay usuarios')}</td></tr>
              ) : (
                users.map(user => {
                  const local = editUsers[user.id] || {};
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {/* <td className="py-3 px-4">{user.id}</td> */}
                      <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 capitalize">{t('role.' + user.role, { defaultValue: user.role })}</td>
                      <td className="py-3 px-4">
                        <select
                          className={`px-2 py-1 text-xs font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            (local.status ?? user.status) === 'active' ? 'bg-green-100 text-green-800' :
                            (local.status ?? user.status) === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            (local.status ?? user.status) === 'suspended' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                          value={local.status ?? user.status}
                          onChange={e => {
                            const newStatus = e.target.value;
                            setEditUsers((edit: any) => ({ ...edit, [user.id]: { ...edit[user.id], status: newStatus } }));
                          }}
                        >
                          <option value="active">{t('adminDashboard.active', { defaultValue: 'Activo' })}</option>
                          <option value="pending">{t('adminDashboard.pending', { defaultValue: 'Pendiente' })}</option>
                          <option value="suspended">{t('adminDashboard.suspended', { defaultValue: 'Suspendido' })}</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Notas internas"
                          value={local.notes ?? user.notes ?? ''}
                          onChange={e => {
                            const notes = e.target.value;
                            setEditUsers((edit: any) => ({ ...edit, [user.id]: { ...edit[user.id], notes } }));
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.createdAt ? user.createdAt.split('T')[0] : ''}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)} disabled={!!saving || !!(currentUser && currentUser.id === user.id)}>
                          Eliminar
                        </Button>
                      </td>
                      {/* <td className="py-3 px-4 space-x-2">
                        <Button size="sm" variant="outline">{t('adminDashboard.manage', 'Gestionar')}</Button>
                        <Button size="sm" variant="outline">Resetear Contraseña</Button>
                        <Button size="sm" variant="outline">Cambiar Rol</Button>
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Users; 