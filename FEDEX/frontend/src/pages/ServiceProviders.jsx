import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const providers = [
    {
        name: 'FedEx',
        color: '#4D148C',
        image: '/providers/fedex.png',
        description: 'Global leader in express transportation, providing rapid, reliable, and time-definite delivery to more than 220 countries and territories.',
        features: ['Real-time Tracking', 'International Priority', 'Customs Clearance']
    },
    {
        name: 'DHL',
        color: '#D40511',
        image: '/providers/dhl.png',
        description: 'The world’s leading logistics company. Our 400,000 people in over 220 countries and territories work every day to help you cross borders.',
        features: ['Global Logistics', 'Express Delivery', 'Supply Chain Solutions']
    },
    {
        name: 'Atlantic',
        color: '#005BBB',
        image: '/providers/atlantic.png',
        description: 'Premium courier services connecting continents with speed and precision. Specialized in handling sensitive and high-value shipments.',
        features: ['Secure Handling', 'Next-Day Delivery', 'Personalized Service']
    },
    {
        name: 'Courier Wala',
        color: '#FF6200',
        image: '/providers/courierwala.png',
        description: 'Your trusted local partner with global reach. Simplified shipping solutions for e-commerce and small businesses.',
        features: ['Door-to-Door', 'Cost-Effective', 'Cash on Delivery']
    },
    {
        name: 'ICL',
        color: '#007934',
        image: '/providers/icl.png',
        description: 'Innovative Cargo Logistics. Delivering excellence through advanced technology and optimized routing networks.',
        features: ['Smart Routing', 'Eco-friendly Options', 'Bulk Freight']
    },
    {
        name: 'PXC Pacific',
        color: '#00A3E0',
        image: '/providers/pxc.png',
        description: 'Specialists in Trans-Pacific trade lanes. Connecting Asian manufacturing hubs with Western markets seamlessly.',
        features: ['Ocean Freight', 'Air Cargo', 'Customs Brokerage']
    },
    {
        name: 'United Express',
        color: '#112E51',
        image: '/providers/united.png',
        description: 'Reliable domestic and international delivery services. Commited to keeping your business moving forward.',
        features: ['Nationwide Network', 'Express Saver', '24/7 Support']
    }
];

const ProviderCard = ({ provider, index }) => {
    // Alternate layout for even/odd items (0 is even, 1 is odd)
    const isAlternate = index % 2 !== 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20%" }}
            transition={{ duration: 0.6 }}
            className="min-h-[60vh] flex items-center justify-center py-20 sticky top-0 bg-white border-t border-gray-100 first:border-none"
        >
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Visual Side */}
                <div className={`
                    relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group
                    transform transition-transform duration-700 hover:scale-[1.02]
                    ${isAlternate ? 'md:order-2' : ''}
                `}>
                    <div className="absolute inset-0 bg-white">
                        <img
                            src={provider.image}
                            alt={provider.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                </div>

                {/* Content Side */}
                <div className={`
                    flex flex-col justify-center space-y-8 
                    ${isAlternate ? 'md:order-1 md:pr-10' : 'md:pl-10'}
                `}>
                    <div className="space-y-4">
                        <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-2 shadow-sm"
                            style={{ backgroundColor: provider.color }}
                        >
                            Partner #{index + 1}
                        </span>
                        <h3
                            className="text-4xl md:text-5xl font-display font-bold text-[#222222] leading-tight"
                        >
                            {provider.name}
                        </h3>
                        <p className="text-xl text-[#555555] leading-relaxed max-w-lg">
                            {provider.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {provider.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4 group cursor-default">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: provider.color }}
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-lg font-medium text-[#333] group-hover:text-[#000] transition-colors">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        to="/track"
                        state={{ provider: provider.name }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-fit px-8 py-4 rounded-xl font-bold text-white shadow-xl flex items-center gap-3 mt-4"
                            style={{ backgroundColor: provider.color }}
                        >
                            Track with {provider.name}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const ServiceProviders = () => {

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block text-brand-400 font-bold tracking-[0.2em] mb-4 uppercase text-sm"
                    >
                        Global Logistics Network
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
                    >
                        Our Service Partners
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto"
                    >
                        We collaborate with the world's leading cargo carriers to ensure your shipments arrive safely and on time, everywhere.
                    </motion.p>
                </div>
            </div>

            {/* Providers List */}
            <div className="relative z-20 bg-white">
                {providers.map((provider, index) => (
                    <ProviderCard key={provider.name} provider={provider} index={index} />
                ))}
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-[#222222] mb-6">Ready to ship?</h2>
                    <p className="text-xl text-[#555555] mb-10 max-w-2xl mx-auto">
                        Choose any of our premium partners and get instant tracking updates directly through our platform.
                    </p>
                    <a href="/track" className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-brand-500/30 transition-all hover:scale-105">
                        Start Tracking Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ServiceProviders;
