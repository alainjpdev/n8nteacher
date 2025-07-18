import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, ClipboardList, BarChart3 } from 'lucide-react';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }).then(res => res.json()).then(setUsers);
    fetch('/api/classes').then(res => res.json()).then(setClasses);
    fetch('/api/assignments').then(res => res.json()).then(setAssignments);
    fetch('/api/modules').then(res => res.json()).then(setModules);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.reportsQuick', 'Reportes del Sistema')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
          <p className="text-gray-600">{t('adminDashboard.totalUsers', 'Total Usuarios')}</p>
        </Card>
        <Card className="text-center">
          <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{classes.length}</h3>
          <p className="text-gray-600">{t('adminDashboard.classes', { count: classes.length })}</p>
        </Card>
        <Card className="text-center">
          <ClipboardList className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{assignments.length}</h3>
          <p className="text-gray-600">{t('adminDashboard.allAssignments', 'Todas las Tareas')}</p>
        </Card>
        <Card className="text-center">
          <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{modules.length}</h3>
          <p className="text-gray-600">{t('adminDashboard.allModules', 'Todos los Módulos')}</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('adminDashboard.performanceAnalysis', 'Análisis de Rendimiento')}</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          {/* Aquí puedes agregar un gráfico real más adelante */}
          <span>Gráfico de rendimiento próximamente...</span>
        </div>
      </Card>
    </div>
  );
};

export default Reports; 