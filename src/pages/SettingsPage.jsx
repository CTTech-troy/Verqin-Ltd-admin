import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

function SettingsPage() {
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [createdUsers, setCreatedUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    setMessage('');
    setShowCreate(v => !v);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setMessage('Name and email are required');
      return;
    }

    // Mock creation: store locally and show success. Replace with API call when available.
    setCreatedUsers(prev => [...prev, { ...newUser, id: Date.now().toString() }]);
    setMessage('Created user (mock)');
    setNewUser({ name: '', email: '', password: '' });
    setShowCreate(false);
  };

  return <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage account and administration actions</p>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Your Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full name</p>
            <p className="text-base text-gray-900">{user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base text-gray-900">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">User ID</p>
            <p className="text-base text-gray-900">{user?.id || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Authenticated</p>
            <p className="text-base text-gray-900">{user ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Administration</h2>
          <div>
            <Button variant="secondary" size="sm" onClick={handleToggle}>
              {showCreate ? 'Cancel' : 'Create New User'}
            </Button>
          </div>
        </div>

        {showCreate && <form onSubmit={handleCreate} className="space-y-4">
            <Input name="name" label="Full name" value={newUser.name} onChange={handleChange} />
            <Input name="email" label="Email" value={newUser.email} onChange={handleChange} />
            <Input name="password" label="Password" type="password" value={newUser.password} onChange={handleChange} />
            <div className="flex items-center gap-3">
              <Button type="submit">Create user</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Close</Button>
            </div>
          </form>}

        {message && <div className="mt-4 text-sm text-sky-600">{message}</div>}

        {createdUsers.length > 0 && <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recently created (local)</h3>
            <div className="space-y-2">
              {createdUsers.map(u => <div key={u.id} className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <Button size="sm" className="bg-red-500 hover:bg-red-400 text-white" variant="ghost" onClick={() => setCreatedUsers(prev => prev.filter(user => user.id !== u.id))}>
                      Delete
                    </Button>
                  </div>)}
            </div>
          </div>}
      </Card>
    </div>;
}

export default SettingsPage;
