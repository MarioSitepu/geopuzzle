'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Username atau password salah.');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <PageTransition className="flex items-center justify-center min-h-[80vh] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-8 sm:p-12 rounded-[2.5rem] text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-linear-to-br from-leaf-500 to-earth-500 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            A
          </div>
          <h1 className="text-3xl font-extrabold text-earth-900 tracking-tight">
            Admin Panel <br />
            <span className="text-leaf-600">Geopuzzle</span>
          </h1>
          <p className="text-earth-600">
            Masuk dengan kredensial administrator Anda.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Username</label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-leaf-400 focus:outline-none transition-all"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-leaf-400 focus:outline-none transition-all"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-linear-to-r from-leaf-500 to-earth-500 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 transition-all duration-300"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </motion.div>
    </PageTransition>
  );
}
