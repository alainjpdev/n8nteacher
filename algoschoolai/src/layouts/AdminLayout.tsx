import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Users, BarChart3, Settings, User, LogOut, Home, UserPlus, Layers, FileText, ClipboardList } from 'lucide-react';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Panel de Control' },
    { to: '/dashboard/users', icon: Users, label: 'Usuarios' },
    { to: '/dashboard/classes', icon: BookOpen, label: 'Clases' },
    { to: '/dashboard/modules', icon: Layers, label: 'Módulos' },
    { to: '/dashboard/materials', icon: FileText, label: 'Materiales' },
    { to: '/dashboard/assignments', icon: ClipboardList, label: 'Tareas' },
    { to: '/dashboard/reports', icon: BarChart3, label: 'Reportes' },
    { to: '/dashboard/studentclasses', icon: UserPlus, label: 'Inscripciones' },
    { to: '/dashboard/settings', icon: Settings, label: 'Configuración' },
    { to: '/dashboard/profile', icon: User, label: 'Perfil' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">{t('appName')}</span>
            </div>
            <LanguageSelector />
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{t('role.' + user?.role)}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};