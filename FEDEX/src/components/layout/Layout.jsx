import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30 selection:text-brand-100">
            <Header />
            <main className="flex-grow pt-20"> {/* PT-20 to account for fixed header */}
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
