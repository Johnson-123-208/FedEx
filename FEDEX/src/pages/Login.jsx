import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('employee'); // 'employee' or 'manager' for visual toggle
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Fetch role to ensure they are logging into the correct portal
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile) {
                if (mode === 'manager' && profile.role !== 'manager') {
                    throw new Error('Access Denied: You do not have Manager privileges.');
                }
                // Redirect based on role
                if (profile.role === 'manager') {
                    navigate('/manager-dashboard');
                } else {
                    navigate('/employee-dashboard');
                }
            } else {
                // Fallback if no profile yet
                navigate('/employee-dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-display text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to access your dashboard</p>
                    </div>

                    {/* Role Toggles */}
                    <div className="bg-slate-950/50 p-1 rounded-xl flex mb-8">
                        <button
                            onClick={() => setMode('employee')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'employee'
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Employee
                        </button>
                        <button
                            onClick={() => setMode('manager')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'manager'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Manager
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-lg font-bold text-white shadow-lg shadow-brand-500/25 transition-all
                                ${mode === 'employee' ? 'bg-brand-500 hover:bg-brand-400' : 'bg-indigo-500 hover:bg-indigo-400'}
                                ${loading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
