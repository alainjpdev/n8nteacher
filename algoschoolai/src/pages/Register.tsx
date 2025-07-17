import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register: registerUser } = useAuthStore();
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password');
    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            const { confirmPassword, ...userData } = data;
            await registerUser(userData);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.message || 'Error al registrar usuario');
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
          <p className="text-gray-600 mt-2">{t('registerPage.title')}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {t('registerPage.error')}
            </div>)}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registerPage.firstName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input type="text" {...register('firstName', {
        required: t('registerPage.firstName') + ' es requerido',
        minLength: {
            value: 2,
            message: 'El nombre debe tener al menos 2 caracteres'
        }
    })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('registerPage.firstName')}/>
                </div>
                {errors.firstName && (<p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registerPage.lastName')}
                </label>
                <input type="text" {...register('lastName', {
        required: t('registerPage.lastName') + ' es requerido',
        minLength: {
            value: 2,
            message: 'El apellido debe tener al menos 2 caracteres'
        }
    })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('registerPage.lastName')}/>
                {errors.lastName && (<p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('registerPage.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="email" {...register('email', {
        required: t('registerPage.email') + ' es requerido',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo inválido'
        }
    })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('registerPage.email')}/>
              </div>
              {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('registerPage.role')}
              </label>
              <select {...register('role', { required: t('registerPage.role') + ' es requerido' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">{t('registerPage.role')}</option>
                <option value="student">{t('registerPage.student')}</option>
                <option value="teacher">{t('registerPage.teacher')}</option>
              </select>
              {errors.role && (<p className="mt-1 text-sm text-red-600">{errors.role.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('registerPage.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type={showPassword ? 'text' : 'password'} {...register('password', {
        required: t('registerPage.password') + ' es requerida',
        minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
        }
    })} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('registerPage.password')}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
              {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('registerPage.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword', {
        required: t('registerPage.confirmPassword') + ' es requerido',
        validate: (value) => value === password || 'Las contraseñas no coinciden'
    })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('registerPage.confirmPassword')}/>
              </div>
              {errors.confirmPassword && (<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>)}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Registrando...' : t('registerPage.registerButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
