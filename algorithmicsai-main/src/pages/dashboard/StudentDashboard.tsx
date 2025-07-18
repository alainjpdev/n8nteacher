import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ClipboardList, Trophy, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [modules, setModules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  // Puedes agregar loading y error states si lo deseas

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(setModules);
    fetch('/api/assignments')
      .then(res => res.json())
      .then(setAssignments);
  }, []);

  // Dummy para upcomingClasses y logros recientes (puedes migrar esto a la base de datos después)
  const upcomingClasses = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('studentDashboard.greeting', { name: user?.firstName })}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('studentDashboard.welcomeBack')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-900">{t('studentDashboard.level', { level: 1 })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{modules.length}</h3>
          <p className="text-gray-600">{t('studentDashboard.activeModules')}</p>
        </Card>
        <Card className="text-center">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</h3>
          <p className="text-gray-600">{t('studentDashboard.classesThisWeek')}</p>
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">0%</h3>
          <p className="text-gray-600">{t('studentDashboard.overallProgress')}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Módulos */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('studentDashboard.myModules')}</h2>
              <Button variant="outline" size="sm">{t('studentDashboard.viewAll')}</Button>
            </div>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    {/* Puedes calcular completedLessons/totalLessons si los tienes en la base de datos */}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  {/* Progress Bar: puedes agregar lógica real si tienes progreso en la base de datos */}
                  <Button size="sm" className="w-full">
                    {t('studentDashboard.continueLearning')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Eliminada la sección de tareas (assignments) */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Próximas Clases eliminada */}

          {/* Logros Recientes */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('studentDashboard.recentAchievements')}</h2>
            <div className="space-y-3 text-gray-600 text-center">
              Aquí se verán tus logros
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};