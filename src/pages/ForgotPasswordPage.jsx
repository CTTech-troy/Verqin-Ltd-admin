import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';
function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSent(true);
    setIsLoading(false);
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              {isSent ? 'Check your email for reset instructions' : 'Enter your email to receive reset instructions'}
            </p>
          </div>

          {!isSent ? <form onSubmit={handleSubmit} className="space-y-6">
              <Input type="email" label="Email Address" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@verqin.com" required />

              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form> : <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm mb-6">
              Password reset instructions have been sent to {email}
            </div>}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>;
}
export default ForgotPasswordPage
