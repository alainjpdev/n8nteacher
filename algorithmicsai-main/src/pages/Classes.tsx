import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Classes: React.FC = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setLoading(false);
      });
    const token = localStorage.getItem('token');
    fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) setUserError('No autorizado. Inicia sesión de nuevo.');
          return [];
        }
        return res.json();
      })
      .then(setUsers);
  }, []);

  const handleTeacherChange = async (classId: string, teacherId: string) => {
    const updatedClasses = classes.map(cls => {
      if (cls.id === classId) {
        return { ...cls, teacherId };
      }
      return cls;
    });
    setClasses(updatedClasses);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setSaveMsg('Profesor asignado correctamente');
    } catch (err) {
      setSaveMsg('Error al asignar profesor');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.allClasses', 'Todas las Clases')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Módulo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Profesor</th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Horario</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {userError ? (
                <tr><td colSpan={5} className="py-6 text-center text-red-600">{userError}</td></tr>
              ) : loading ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-500">{t('loading', 'Cargando...')}</td></tr>
              ) : classes.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-500">{t('adminDashboard.noClasses', 'No hay clases')}</td></tr>
              ) : (
                classes.map(cls => (
                  <tr key={cls.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* <td className="py-3 px-4">{cls.id}</td> */}
                    <td className="py-3 px-4">{cls.title}</td>
                    <td className="py-3 px-4">{cls.description}</td>
                    <td className="py-3 px-4">{cls.module?.title || '-'}</td>
                    <td className="py-3 px-4">
                      {Array.isArray(users) && users.length > 0 ? (
                        <select
                          value={cls.teacherId || ''}
                          onChange={e => handleTeacherChange(cls.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="">Sin asignar</option>
                          {users.filter(u => u.role === 'teacher').map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400">No hay profesores</span>
                      )}
                    </td>
                    {/* <td className="py-3 px-4">{cls.schedule}</td> */}
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">{t('adminDashboard.manage', 'Gestionar')}</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {saveMsg && <div className={saveMsg.includes('Error') ? 'text-red-600 mt-2' : 'text-green-600 mt-2'}>{saveMsg}</div>}
    </div>
  );
};

export default Classes; 