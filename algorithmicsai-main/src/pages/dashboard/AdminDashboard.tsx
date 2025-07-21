import React, { useEffect, useState } from 'react';
import { Users, BookOpen, TrendingUp, AlertTriangle, UserPlus, Settings, BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // Estados para datos reales
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(setUsers);
    fetch(`${import.meta.env.VITE_API_URL}/api/classes`)
      .then(res => res.json())
      .then(setClasses);
    fetch(`${import.meta.env.VITE_API_URL}/api/modules`)
      .then(res => res.json())
      .then(setModules);
    fetch(`${import.meta.env.VITE_API_URL}/api/assignments`)
      .then(res => res.json())
      .then(setAssignments);
  }, []);

  // Calcular estadísticas
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const activeStudents = Array.isArray(users) ? users.filter(u => u.role === 'student' && u.status === 'active').length : 0;
  const totalTeachers = Array.isArray(users) ? users.filter(u => u.role === 'teacher').length : 0;
  const totalClasses = Array.isArray(classes) ? classes.length : 0;
  // Dummy para crecimiento y tasa de finalización
  const monthlyGrowth = 12.5;
  const completionRate = 87.3;

  // Usuarios recientes (últimos 4 por fecha de creación si existe, si no, por id)
  const recentUsers = Array.isArray(users)
    ? [...users]
        .sort((a, b) => (b.createdAt || b.id) > (a.createdAt || a.id) ? 1 : -1)
        .slice(0, 4)
        .map(u => ({
          id: u.id,
          name: u.firstName + ' ' + u.lastName,
          email: u.email,
          role: u.role,
          status: u.status,
          joinDate: u.createdAt ? u.createdAt.split('T')[0] : ''
        }))
    : [];

  // Asignación de profesores (clases con su profesor)
  const teacherAssignments = Array.isArray(classes) && Array.isArray(users)
    ? classes.map(cls => {
        const teacher = users.find(u => u.id === cls.teacherId);
        return {
          id: cls.id,
          teacherName: teacher ? (teacher.firstName + ' ' + teacher.lastName) : t('adminDashboard.unassigned'),
          className: cls.title,
          students: cls.studentsCount || 0, // si tienes este campo
          status: teacher ? 'active' : 'pending'
        };
      })
    : [];

  // Alertas dummy
  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      message: t('adminDashboard.class') + ' "IA Básica" ' + t('adminDashboard.unassigned'),
      timestamp: '2 horas'
    },
    {
      id: '2',
      type: 'info',
      message: '3 ' + t('adminDashboard.activeStudents').toLowerCase() + ' ' + t('adminDashboard.pending').toLowerCase(),
      timestamp: '4 horas'
    },
    {
      id: '3',
      type: 'success',
      message: 'Backup automático completado exitosamente',
      timestamp: '6 horas'
    }
  ];

  const systemStats = {
    totalUsers,
    activeStudents,
    totalTeachers,
    totalClasses,
    monthlyGrowth,
    completionRate
  };

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/${classId}`, {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">
            {t('adminDashboard.title')}
          </h1>
          <p className="text-text-secondary mt-1">
            {t('adminDashboard.subtitle')}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-5 h-5 mr-2" />
            {t('adminDashboard.settings')}
          </Button>
          <Button>
            <UserPlus className="w-5 h-5 mr-2" />
            {t('adminDashboard.newUser')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-text">{systemStats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-600">{t('adminDashboard.totalUsers')}</p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{t('adminDashboard.monthlyGrowth', { growth: systemStats.monthlyGrowth })}</span>
          </div>
        </Card>
        <Card className="text-center">
          <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-text">{systemStats.activeStudents}</h3>
          <p className="text-gray-600">{t('adminDashboard.activeStudents')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('adminDashboard.ofTotal', { total: systemStats.totalUsers })}</p>
        </Card>
        <Card className="text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-text">{systemStats.totalTeachers}</h3>
          <p className="text-gray-600">{t('adminDashboard.teachers')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('adminDashboard.classes', { count: systemStats.totalClasses })}</p>
        </Card>
        <Card className="text-center">
          <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-text">{systemStats.completionRate}%</h3>
          <p className="text-gray-600">{t('adminDashboard.completionRate')}</p>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">{t('adminDashboard.completionGrowth', { growth: 2.3 })}</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usuarios Recientes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">{t('adminDashboard.recentUsers')}</h2>
              <Button variant="outline" size="sm">{t('adminDashboard.viewAll')}</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-text">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Fecha de Ingreso</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'teacher' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'teacher' ? t('role.teacher') : t('role.student')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status === 'active' ? t('adminDashboard.active') : t('adminDashboard.pending')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.joinDate}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          {t('adminDashboard.manage')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Asignación de Profesores */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">{t('adminDashboard.teacherAssignments')}</h2>
              <Button variant="outline" size="sm">{t('adminDashboard.manageAll')}</Button>
            </div>
            <div className="space-y-3">
              {teacherAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{assignment.className}</h3>
                    <p className="text-sm text-gray-600">
                      {t('adminDashboard.teacher')}: {assignment.teacherName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('adminDashboard.studentsEnrolled', { count: assignment.students })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      assignment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status === 'active' ? t('adminDashboard.assigned') : t('adminDashboard.unassigned')}
                    </span>
                    <Button size="sm" variant={assignment.status === 'pending' ? 'primary' : 'outline'}>
                      {assignment.status === 'pending' ? t('adminDashboard.assign') : t('adminDashboard.change')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alertas del Sistema */}
          <Card>
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.systemAlerts')}</h2>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'info' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('adminDashboard.ago', { time: alert.timestamp })}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4">
              {t('adminDashboard.seeAllAlerts')}
            </Button>
          </Card>

          {/* Reportes Rápidos */}
          <Card>
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.reportsQuick')}</h2>
            <div className="space-y-3">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('adminDashboard.userReport')}
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                {t('adminDashboard.classStats')}
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('adminDashboard.performanceAnalysis')}
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                {t('adminDashboard.financialReport')}
              </Button>
            </div>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.quickActions')}</h2>
            <div className="space-y-3">
              <Button size="sm" className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                {t('adminDashboard.createUser')}
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                {t('adminDashboard.newClass')}
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                {t('adminDashboard.alertConfig')}
              </Button>
            </div>
          </Card>

          <Card className="mt-8">
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.allClasses', 'Todas las Clases')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-text">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Título</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Módulo</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Profesor</th>
                    {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Horario</th> */}
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => (
                    <tr key={cls.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{cls.id}</td>
                      <td className="py-3 px-4">{cls.title}</td>
                      <td className="py-3 px-4">{cls.description}</td>
                      <td className="py-3 px-4">{cls.module?.title || '-'}</td>
                      <td className="py-3 px-4">
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
                      </td>
                      {/* <td className="py-3 px-4">{cls.schedule}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {saveMsg && <div className={saveMsg.includes('Error') ? 'text-red-600 mt-2' : 'text-green-600 mt-2'}>{saveMsg}</div>}
          </Card>

          <Card className="mt-8">
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.allModules', 'Todos los Módulos')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-text">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Título</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{module.id}</td>
                      <td className="py-3 px-4">{module.title}</td>
                      <td className="py-3 px-4">{module.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="mt-8">
            <h2 className="text-xl font-bold text-text mb-4">{t('adminDashboard.allAssignments', 'Todas las Tareas')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-text">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Título</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Clase</th>
                    <th className="text-left py-3 px-4 font-medium text-text">Fecha Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{a.id}</td>
                      <td className="py-3 px-4">{a.title}</td>
                      <td className="py-3 px-4">{a.description}</td>
                      <td className="py-3 px-4">{a.classId || '-'}</td>
                      <td className="py-3 px-4">{a.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};