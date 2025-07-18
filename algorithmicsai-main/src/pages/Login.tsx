import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data: any) => {
        console.log('Submit ejecutado', data);
        setIsLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            // Redirigir a la página solicitada o al dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
        catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white"/>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Algorithmics AI</h1>
          <p className="text-gray-600 mt-2">{t('loginPage.title')}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {t('loginPage.error')}
            </div>)}

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">{t('loginPage.demoCredentials')}</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>{t('loginPage.student')}</strong> student@algorithmics.com</p>
              <p><strong>{t('loginPage.teacher')}</strong> teacher@algorithmics.com</p>
              <p><strong>{t('loginPage.admin')}</strong> admin@algorithmics.com</p>
              <p><strong>{t('loginPage.password')}</strong> password123</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('loginPage.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="email" {...register('email', {
        required: t('loginPage.email') + ' ' + 'es requerido',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('loginPage.email') + ' inválido'
        }
    })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="tu@email.com"/>
              </div>
              {typeof errors.email?.message === 'string' && (<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('loginPage.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type={showPassword ? 'text' : 'password'} {...register('password', { required: t('loginPage.password') + ' es requerida' })} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="********"/>
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                  <span className="sr-only">{showPassword ? t('loginPage.hidePassword') : t('loginPage.showPassword')}</span>
                </button>
              </div>
              {typeof errors.password?.message === 'string' && (<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {t('loginPage.loginButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('loginPage.registerLink')}
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              {t('loginPage.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
