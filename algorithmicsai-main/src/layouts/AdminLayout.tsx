import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Users, BarChart3, Settings, User, LogOut, Home, UserPlus, Layers, FileText, ClipboardList, ExternalLink, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../hooks/useDarkMode';
import { Moon, Sun } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [dark, setDark] = useDarkMode();
  const [collapsed, setCollapsed] = React.useState(false);

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
    { to: '/dashboard/profile', icon: User, label: 'Perfil' },
    { to: '/dashboard/notion', icon: Database, label: 'Notion' }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 ${collapsed ? 'w-16' : 'w-64'} bg-sidebar shadow-lg border-r border-border transition-all duration-200`}>
        <div className="flex flex-col h-full relative">
          {/* Collapse Button (centered vertically) */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="absolute top-1/2 -right-4 z-20 transform -translate-y-1/2 bg-panel shadow-lg border border-border p-2 rounded-full hover:bg-border transition"
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-text" /> : <ChevronLeft className="w-5 h-5 text-text" />}
          </button>
          {/* Logo + LanguageSelector */}
          <div className="flex items-center px-2 py-4 border-b border-border justify-between bg-sidebar">
            <span className={`ml-2 text-xl font-bold text-text transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{t('appName')}</span>
            <div className="flex items-center gap-2 ml-auto">
              {!collapsed && <LanguageSelector />}
            </div>
          </div>
          {/* User Info */}
          {!collapsed && (
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-text">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">{t('role.' + user?.role)}</p>
                </div>
              </div>
            </div>
          )}
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg text-sm font-medium transition-colors ` +
                  (isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-hover hover:text-text')
                }
              >
                <item.icon className="w-5 h-5 mr-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          {/* Logout */}
          <div className="px-2 py-4 border-t border-border">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium text-text-secondary hover:bg-border hover:text-text rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5 mr-0" />
              {!collapsed && <span className="ml-3">{t('logout')}</span>}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className={`${collapsed ? 'ml-16' : 'ml-64'} bg-bg min-h-screen transition-all duration-200`}>
        <main className="p-6">
          {/* Fondo y textos actualizados a la nueva paleta */}
          <Outlet key={i18n.language} />
        </main>
      </div>
    </div>
  );
};