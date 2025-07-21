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
    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError('');
        try {
            const { confirmPassword, ...userData } = data;
            await registerUser({ ...userData, role: 'student' }); // Forzar rol student
            navigate('/dashboard');
        }
        catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* Logo oculto */}
          {/* <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white"/>
            </div>
          </div> */}
          <h1 className="text-3xl font-bold text-text">Algorithmics AI</h1>
          <p className="text-text-secondary mt-2">{t('registerPage.title')}</p>
        </div>

        {/* Form */}
        <div className="bg-panel rounded-lg shadow-lg p-8 border border-border">
          {error && (<div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-lg">
              {t('registerPage.error')}
            </div>)}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {t('registerPage.firstName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"/>
                  <input type="text" {...register('firstName', {
        required: t('registerPage.firstName') + ' es requerido',
        minLength: {
            value: 2,
            message: 'El nombre debe tener al menos 2 caracteres'
        }
    })} className="w-full pl-10 pr-3 py-2 border border-border bg-panel text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={t('registerPage.firstName')}/>
                </div>
                {typeof errors.firstName?.message === 'string' && (<p className="mt-1 text-sm text-error">{errors.firstName.message}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {t('registerPage.lastName')}
                </label>
                <input type="text" {...register('lastName', {
        required: t('registerPage.lastName') + ' es requerido',
        minLength: {
            value: 2,
            message: 'El apellido debe tener al menos 2 caracteres'
        }
    })} className="w-full px-3 py-2 border border-border bg-panel text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={t('registerPage.lastName')}/>
                {typeof errors.lastName?.message === 'string' && (<p className="mt-1 text-sm text-error">{errors.lastName.message}</p>)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('registerPage.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"/>
                <input type="email" {...register('email', {
        required: t('registerPage.email') + ' es requerido',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo inválido'
        }
    })} className="w-full pl-10 pr-3 py-2 border border-border bg-panel text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={t('registerPage.email')}/>
              </div>
              {typeof errors.email?.message === 'string' && (<p className="mt-1 text-sm text-error">{errors.email.message}</p>)}
            </div>

            {/* Campo de selección de rol eliminado */}

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('registerPage.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"/>
                <input type={showPassword ? 'text' : 'password'} {...register('password', {
        required: t('registerPage.password') + ' es requerida',
        minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
        }
    })} className="w-full pl-10 pr-10 py-2 border border-border bg-panel text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={t('registerPage.password')}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
              {typeof errors.password?.message === 'string' && (<p className="mt-1 text-sm text-error">{errors.password.message}</p>)}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t('registerPage.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"/>
                <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword', {
        required: t('registerPage.confirmPassword') + ' es requerido',
        validate: (value) => value === password || 'Las contraseñas no coinciden'
    })} className="w-full pl-10 pr-3 py-2 border border-border bg-panel text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder={t('registerPage.confirmPassword')}/>
              </div>
              {typeof errors.confirmPassword?.message === 'string' && (<p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>)}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Registrando...' : t('registerPage.registerButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-primary font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-text-secondary hover:text-text">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
