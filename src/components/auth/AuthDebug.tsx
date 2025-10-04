import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, session, loading, error } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-xs space-y-1">
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.email : 'Not logged in'}</p>
        <p>Session: {session ? 'Active' : 'None'}</p>
        {error && <p className="text-red-400">Error: {error}</p>}
      </div>
    </div>
  );
};

export default AuthDebug;
