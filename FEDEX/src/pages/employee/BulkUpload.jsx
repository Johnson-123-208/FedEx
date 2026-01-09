import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BulkUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setStatus('uploading');

        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus('processing');
                    // Simulate processing time then finish
                    setTimeout(() => {
                        setStatus('completed');
                    }, 3000); // 3 seconds processing loop
                    return 100;
                }
                return prev + 5;
            });
        }, 50);
    };

    const handleReset = () => {
        setFile(null);
        setStatus('idle');
        setProgress(0);
    };

    return (
        <div className="w-full px-6 py-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[#222222] mb-2 font-display">Bulk Shipment Upload</h1>
                <p className="text-[#555555]">Upload your Excel manifest to track multiple shipments instantly.</p>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#EEEEEE] p-8 max-w-3xl mx-auto min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">

                <AnimatePresence mode="wait">
                    {/* IDLE STATE */}
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full text-center"
                        >
                            <div className="mb-8">
                                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-100 border-dashed">
                                    <span className="text-4xl">📂</span>
                                </div>
                                <h2 className="text-xl font-bold text-[#222222] mb-2">Upload Shipment Manifest</h2>
                                <p className="text-[#555555] mb-6">Supported formats: .xlsx, .csv</p>

                                <div className="relative inline-block">
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button className="btn-secondary px-8 py-3">
                                        Choose File
                                    </button>
                                </div>
                                {file && (
                                    <div className="mt-4 p-3 bg-brand-50 rounded-lg inline-flex items-center gap-2 text-brand-700 font-medium text-sm">
                                        <span>📄</span>
                                        {file.name}
                                        <button onClick={() => setFile(null)} className="ml-2 hover:text-red-500">✕</button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="btn-primary px-12 py-4 text-lg shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105"
                            >
                                Track Now
                            </button>
                        </motion.div>
                    )}

                    {/* UPLOADING STATE */}
                    {status === 'uploading' && (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-md text-center"
                        >
                            <h3 className="text-xl font-bold text-[#222222] mb-6">Uploading Data...</h3>
                            <div className="w-full bg-[#EEEEEE] h-4 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-brand-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-[#555555] mt-2 font-mono">{progress}%</p>
                        </motion.div>
                    )}

                    {/* PROCESSING STATE (LOOP ANIMATION) */}
                    {status === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <motion.div
                                    className="absolute inset-0 border-4 border-brand-200 rounded-full"
                                />
                                <motion.div
                                    className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl animate-pulse">⚡</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-[#222222] mb-2">Processing Shipments</h2>
                            <p className="text-[#555555]">Syncing with global network...</p>
                        </motion.div>
                    )}

                    {/* COMPLETED STATE */}
                    {status === 'completed' && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">✅</span>
                            </div>
                            <h2 className="text-3xl font-bold text-[#222222] mb-4">Tracking Complete!</h2>
                            <p className="text-[#555555] mb-8">Processed {Math.floor(Math.random() * 50) + 10} shipments successfully.</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Report
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-4 bg-white border-2 border-[#EEEEEE] hover:bg-[#F5F5F5] text-[#555555] rounded-xl font-bold transition-colors"
                                >
                                    Upload Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BulkUpload;
