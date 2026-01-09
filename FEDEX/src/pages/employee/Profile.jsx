import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, role } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-[#222222] mb-6 font-display">My Profile</h1>

            <div className="bg-white border-2 border-[#EEEEEE] rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#222222]">Agent</h2>
                        <p className="text-[#555555]">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-brand-100 text-brand-700 text-xs rounded-full border border-brand-200 uppercase tracking-wider">
                            {role}
                        </span>
                    </div>
                </div>

                <div className="border-t border-[#EEEEEE] pt-6">
                    <h3 className="text-lg font-medium text-[#222222] mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-[#777777] mb-1">User ID</label>
                            <p className="text-[#222222] font-mono text-sm">{user.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-[#777777] mb-1">Last Sign In</label>
                            <p className="text-[#222222]">{new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
