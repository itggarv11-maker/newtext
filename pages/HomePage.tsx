import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'https://esm.sh/react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'https://esm.sh/framer-motion';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { 
    AcademicCapIcon, RocketLaunchIcon, SparklesIcon, 
    BrainCircuitIcon, ScaleIcon, CalendarDaysIcon, 
    GavelIcon, VideoCameraIcon, BeakerIcon, CheckBadgeIcon,
    ShieldCheckIcon, BoltIcon, StarIcon, CursorArrowRaysIcon,
    CheckCircleIcon, XCircleIcon
} from '../components/icons';
import Spinner from '../components/common/Spinner';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, loading, loginWithGoogle } = useAuth();
    const [authLoading, setAuthLoading] = useState(false);
    const { scrollY } = useScroll();
    
    const words = ["TOPS", "SPEED", "MASTERY"]; 
    const [wordIndex, setWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const heroY = useTransform(scrollY, [0, 500], [0, 100]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        if (!loading && currentUser) navigate('/app', { replace: true });
    }, [currentUser, loading, navigate]);

    useEffect(() => {
        let timer: number;
        const typingSpeed = isDeleting ? 30 : 60; 
        const targetWord = words[wordIndex];

        if (!isDeleting && currentText === targetWord) {
            timer = window.setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && currentText === "") {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
        } else {
            timer = window.setTimeout(() => {
                setCurrentText(prev => isDeleting ? prev.substring(0, prev.length - 1) : targetWord.substring(0, prev.length + 1));
            }, typingSpeed);
        }
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, wordIndex]);

    const handleGoogleLogin = async () => {
        setAuthLoading(true);
        try { await loginWithGoogle(); navigate('/app'); } catch (error) { console.error(error); } finally { setAuthLoading(false); }
    };

    return (
        <div className="relative min-h-screen bg-[#010208] text-white selection:bg-cyan-500/30 overflow-x-hidden hero-gradient">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="neural-scan"></div>
            </div>

            {/* RESPONSIVE HERO SECTION */}
            <header className="relative z-10 pt-32 pb-20 px-6 text-center lg:min-h-[90vh] flex flex-col justify-center items-center">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl">
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-xl shadow-2xl"
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Astra Engine v8.5 Active</span>
                        </motion.div>

                        <div className="flex items-center gap-8 md:gap-12 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] opacity-50">
                            <span className="flex items-center gap-2"><CheckBadgeIcon className="w-4 h-4 text-emerald-500"/> NCERT Verified</span>
                            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                            <span className="flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-amber-500"/> Board 2025 Optimized</span>
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tightest leading-[0.9] mb-12 uppercase drop-shadow-2xl">
                        STUDY AT THE <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white/20">SPEED OF </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-600 italic drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                            {currentText}<span className="animate-pulse">_</span>
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-16 font-medium leading-relaxed tracking-tight px-10">
                        The elite <span className="text-white">study infrastructure</span> used by India's top 1%. Transform notes into mastery with precision AI logic.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                        <Link to="/signup">
                            <Button size="lg" className="w-64 md:w-80 h-20 md:h-24 !text-xl md:!text-3xl !font-black uppercase tracking-tighter bg-white !text-slate-950 shadow-[0_40px_100px_rgba(255,255,255,0.15)] hover:scale-[1.03] transition-all !rounded-[2.5rem] italic">
                                INITIALIZE →
                            </Button>
                        </Link>
                        <button onClick={handleGoogleLogin} disabled={authLoading} className="w-64 md:w-80 h-20 md:h-24 glass-card border-white/10 rounded-[2.5rem] flex items-center justify-center gap-6 hover:bg-white/5 transition-all group">
                            {authLoading ? <Spinner /> : (
                                <>
                                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                                        <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/></svg>
                                    </div>
                                    <span className="text-xl md:text-2xl font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors italic">Cloud Sync</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* LIVE PERFORMANCE METRICS - FILLING THE GAP */}
            <section className="relative z-10 py-20 bg-[#05070f] border-y border-white/5 backdrop-blur-3xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
                    <RocketLaunchIcon className="w-[800px] h-[800px] -rotate-12" />
                </div>
                <div className="container mx-auto px-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    <StatBox value="101%" label="Accuracy Rate" color="text-cyan-400" />
                    <StatBox value="0.18s" label="Response Speed" color="text-violet-400" />
                    <StatBox value="850K+" label="Problems Solved" color="text-pink-400" />
                    <StatBox value="Top 1%" label="User Results" color="text-emerald-400" />
                </div>
            </section>

            {/* COMMAND HQ GRID SECTION */}
            <section className="relative z-10 px-6 md:px-20 py-32 bg-[#010208]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
                        <div className="text-left">
                            <h2 className="text-[11px] font-black text-violet-400 uppercase tracking-[1.5em] mb-6 italic opacity-60">Mastery Suite</h2>
                            <p className="text-6xl md:text-8xl font-black tracking-tightest leading-none uppercase italic">COMMAND HQ</p>
                        </div>
                        <p className="text-slate-400 max-w-lg text-lg md:text-xl font-medium leading-relaxed italic border-l-2 border-violet-600 pl-8">
                            Zero distractions. Elite logic. Every tool designed for maximum academic leverage.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <BentoBox 
                            className="md:col-span-8 md:row-span-2 min-h-[550px]"
                            icon={<ScaleIcon className="w-24 h-24" />}
                            title="Brahmastra"
                            tag="PRECISION CORE"
                            desc="The world's most reliable mathematical logic engine. 101% error-free board solutions."
                            color="bg-amber-500"
                            image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
                        />
                        <BentoBox 
                            className="md:col-span-4"
                            icon={<RocketLaunchIcon className="w-12 h-12" />}
                            title="Careers"
                            tag="ASTRA ROADMAP"
                            desc="Mapping your journey from grade 10 to world-class professional."
                            color="bg-violet-600"
                        />
                        <BentoBox 
                            className="md:col-span-4"
                            icon={<CalendarDaysIcon className="w-12 h-12" />}
                            title="War Plan"
                            tag="STRATEGY"
                            desc="Study schedules that adapt to your peak mental cycles."
                            color="bg-pink-600"
                        />
                        <BentoBox 
                            className="md:col-span-6"
                            icon={<VideoCameraIcon className="w-12 h-12" />}
                            title="Cinema"
                            tag="VISUAL MEMORY"
                            desc="Watch your history and science chapters as cinematic films."
                            color="bg-rose-500"
                        />
                        <BentoBox 
                            className="md:col-span-6"
                            icon={<BeakerIcon className="w-12 h-12" />}
                            title="Digital Lab"
                            tag="SIMULATION"
                            desc="Conduct 3D physics and chemistry experiments in a virtual void."
                            color="bg-cyan-500"
                        />
                    </div>
                </div>
            </section>

            {/* THE PREMIUM ASCENSION - CONVERSION ENGINE */}
            <section className="relative z-10 px-6 py-40 bg-[#010208] border-t border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-pink-500/50"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">Tier Ascension</span>
                        <div className="h-[1px] w-12 bg-pink-500/50"></div>
                    </div>
                    
                    <h2 className="text-6xl md:text-[10rem] font-black tracking-tightest uppercase mb-12 italic leading-[0.8]">
                        UNLEASH THE <span className="text-violet-500 text-glow-violet">OMEGA CORE</span>
                    </h2>

                    {/* COMPARISON MATRIX - FILLING SPACE & BUILDING VALUE */}
                    <div className="max-w-5xl mx-auto glass-card !bg-white/5 rounded-[4rem] border-white/10 p-6 md:p-12 mb-32 shadow-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-6 text-sm font-black uppercase tracking-widest text-slate-500">Capabilities</th>
                                    <th className="py-6 text-sm font-black uppercase tracking-widest text-slate-500 text-center">Guest Mode</th>
                                    <th className="py-6 text-sm font-black uppercase tracking-widest text-violet-400 text-center">Omega Premium</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <ComparisonRow label="Ultra-High Logic Inference" free={false} premium={true} />
                                <ComparisonRow label="Unlimited Brain Power (Tokens)" free={false} premium={true} />
                                <ComparisonRow label="Board Mark Guaranteed Math" free={true} premium={true} />
                                <ComparisonRow label="Cinematic Video Generation" free={false} premium={true} />
                                <ComparisonRow label="24/7 Priority Server Access" free={false} premium={true} />
                                <ComparisonRow label="Advanced Lab Simulations" free={true} premium={true} />
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <PremiumFeature 
                            icon={<BoltIcon className="w-10 h-10 text-cyan-400"/>}
                            title="Infinite Tokens"
                            desc="No caps on intelligence. Process 1,000+ page textbooks in seconds."
                        />
                        <PremiumFeature 
                            icon={<ShieldCheckIcon className="w-10 h-10 text-emerald-400"/>}
                            title="Priority Access"
                            desc="Skip all waiting queues with dedicated ultra-high speed servers."
                        />
                        <PremiumFeature 
                            icon={<StarIcon className="w-10 h-10 text-amber-400"/>}
                            title="Pro 3.1 Model"
                            desc="Exclusive access to Gemini 3.1 Pro—the world's smartest AI model."
                        />
                    </div>

                    <div className="mt-32 max-w-5xl mx-auto glass-card !bg-violet-600/5 border-violet-500/30 !rounded-[5rem] p-16 md:p-24 relative overflow-hidden group shadow-[0_0_150px_rgba(124,58,237,0.2)]">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                            <div className="text-left space-y-8">
                                <h3 className="text-5xl md:text-8xl font-black tracking-tightest uppercase italic leading-[0.8]">ASCEND <br/><span className="text-violet-500">NOW</span></h3>
                                <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-md italic">Join 50,000+ top students who have already moved to the Omega Core.</p>
                            </div>
                            <div className="flex flex-col gap-8 w-full md:w-auto">
                                <Link to="/premium">
                                    <Button size="lg" className="w-full h-24 md:w-[28rem] !text-3xl !font-black uppercase tracking-widest shadow-[0_0_80px_rgba(139,92,246,0.5)] hover:scale-105 transition-transform !rounded-[2.5rem] bg-gradient-to-r from-violet-600 to-indigo-600">GET FULL ACCESS</Button>
                                </Link>
                                <div className="flex items-center justify-center gap-3">
                                     <div className="flex -space-x-3">
                                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#010208] bg-slate-800"></div>)}
                                     </div>
                                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Validated by Toppers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ComparisonRow = ({ label, free, premium }: any) => (
    <tr className="border-b border-white/5 group hover:bg-white/5 transition-colors">
        <td className="py-6 font-bold text-slate-400 group-hover:text-white transition-colors">{label}</td>
        <td className="py-6 text-center">{free ? <CheckCircleIcon className="w-6 h-6 text-slate-700 mx-auto" /> : <XCircleIcon className="w-6 h-6 text-slate-800 mx-auto" />}</td>
        <td className="py-6 text-center"><CheckCircleIcon className="w-8 h-8 text-violet-500 mx-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" /></td>
    </tr>
);

const StatBox = ({ value, label, color }: any) => (
    <div className="group cursor-default">
        <p className={`text-5xl md:text-8xl font-black tracking-tightest ${color} transition-all duration-700 group-hover:scale-110`}>{value}</p>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-4 italic">{label}</p>
    </div>
);

const PremiumFeature = ({ icon, title, desc }: any) => (
    <div className="p-12 glass-card !rounded-[4rem] border-white/5 hover:border-violet-500/30 transition-all text-center group cursor-default shadow-xl">
        <div className="w-24 h-24 rounded-[2rem] bg-white/5 mx-auto mb-10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-inner">
            {icon}
        </div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">{desc}</p>
    </div>
);

const BentoBox = ({ className, icon, title, desc, color, image, tag }: any) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div 
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.015, y: -10 }}
            className={`glass-card group overflow-hidden relative border-white/5 cursor-pointer shadow-[0_50px_150px_rgba(0,0,0,0.8)] transition-all duration-[0.6s] ${className} !rounded-[4rem]`}
        >
            <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.05), transparent 40%)` }}
            />
            {image && (
                <div className="absolute inset-0 z-0 opacity-[0.1] group-hover:opacity-[0.3] transition-all duration-[1.5s] grayscale group-hover:grayscale-0">
                    <img src={image} alt="" className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-transform duration-[2.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010208] to-transparent"></div>
                </div>
            )}
            <div className="relative z-10 p-12 md:p-16 h-full flex flex-col justify-end">
                <div className="mb-12 flex justify-between items-start">
                    <div className={`w-20 h-20 rounded-[2rem] ${color} bg-opacity-20 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl`}>
                        {icon}
                    </div>
                    {tag && (
                        <span className="text-[10px] font-black text-slate-500 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 tracking-[0.4em] uppercase italic">{tag}</span>
                    )}
                </div>
                <h3 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tightest group-hover:text-cyan-400 transition-colors leading-[0.8] italic">{title}</h3>
                <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-medium group-hover:text-slate-200 transition-colors max-w-md">{desc}</p>
            </div>
        </motion.div>
    );
};

export default HomePage;