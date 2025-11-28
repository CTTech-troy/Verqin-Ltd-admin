import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import  Input  from '../components/ui/Input';
import  Button  from '../components/ui/Button';
import  Card  from '../components/ui/Card';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verqin Ltd
            </h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input type="email" label="Email Address" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@verqin.com" required />

            <Input type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>}

            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <a href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 transition-colors">
                Forgot your password?
              </a>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            Demo credentials: admin@verqin.com / admin123
          </div>
        </Card>
      </div>
    </div>;
}

export default LoginPage