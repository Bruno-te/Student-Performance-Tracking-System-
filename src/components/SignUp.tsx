import React, { useState } from 'react';

interface SignUpProps {
  onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5051/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Account created! You can now log in.');
        setTimeout(onClose, 1500);
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
          <select className="w-full border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 