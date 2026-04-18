import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_REDIRECT } from '../../utils/constants';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      navigate(ROLE_REDIRECT[user.role] || '/');
    } catch (err) {
      setError('root', { message: err?.message || 'Sai tài khoản hoặc mật khẩu' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Vui lòng nhập email' })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {errors.root && <p className="text-red-500 text-xs">{errors.root.message}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}
