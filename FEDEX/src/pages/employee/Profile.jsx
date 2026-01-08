import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, role } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 font-display">My Profile</h1>

            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Agent</h2>
                        <p className="text-slate-400">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-brand-500/20 text-brand-300 text-xs rounded-full border border-brand-500/30 uppercase tracking-wider">
                            {role}
                        </span>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">User ID</label>
                            <p className="text-slate-300 font-mono text-sm">{user.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Last Sign In</label>
                            <p className="text-slate-300">{new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
