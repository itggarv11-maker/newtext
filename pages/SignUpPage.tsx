
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';
import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '../components/icons';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const REQUIRED_INVITE_CODE = "GARVBRO";
  const isInviteValid = inviteCode.trim().toUpperCase() === REQUIRED_INVITE_CODE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInviteValid) return setError('Encryption Mismatch. Key Denied.');
    if (password !== confirmPassword) return setError('Neural Key Unmatched.');
    if (!name.trim()) return setError('Identity Identity Needed.');
    
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Transmission Failure.');
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    if (!isInviteValid) return setError('Unlock with Astral Key first.');
    setError('');
    setLoading(true);
    try {
        await loginWithGoogle();
        navigate('/app');
    } catch (err: any) {
        setError(err.message || 'Sync failed.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] font-mono text-[8px] pointer-events-none select-none overflow-hidden leading-tight">
          {Array(100).fill('STUBRO_AI_ENCRYPTED_VAULT_NODE_778_').join(' ')}
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Card variant="dark" className="!p-16 md:!p-20 shadow-[0_0_100px_rgba(139,92,246,0.2)] border-white/5 !rounded-[4rem] bg-slate-900/80">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">THE <span className="text-violet-500">VAULT</span></h1>
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Access is restricted. Invite only.</p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl text-center mb-10 text-[10px] font-black uppercase tracking-widest">
                ALERT: {error}
            </motion.div>
          )}

          <div className="space-y-12">
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">01. Neural Invite Key</label>
              <input 
                type="password" 
                value={inviteCode} 
                onChange={(e) => {
                    setInviteCode(e.target.value);
                    if (e.target.value.toUpperCase() === REQUIRED_INVITE_CODE) setError('');
                }} 
                required 
                autoComplete="off"
                className={`w-full px-6 py-6 border-2 rounded-[2rem] outline-none text-white font-black text-center tracking-[1em] transition-all text-2xl ${isInviteValid ? 'bg-green-500/5 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-slate-950 border-slate-800 focus:border-violet-500'}`} 
                placeholder="•••••••"
              />
              {isInviteValid && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-green-500 bg-slate-950 px-4 py-1 rounded-full border border-green-500/30">
                      <CheckBadgeIcon className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">DECRYPTED</span>
                  </div>
              )}
            </div>

            <div className="space-y-8">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">02. Choose Entry Protocol</label>
                
                <button 
                    onClick={handleGoogleSignup}
                    disabled={loading || !isInviteValid}
                    className={`w-full h-20 bg-white rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl group ${!isInviteValid ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-[1.02]'}`}
                >
                    {loading ? <Spinner colorClass="bg-violet-600" /> : (
                        <>
                            <div className="p-1.5 bg-slate-100 rounded-full group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"/></svg>
                            </div>
                            <span className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Sync via Google</span>
                        </>
                    )}
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-900 px-4 text-slate-500 font-black">OR SECURE MAIL</span></div>
                </div>

                <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-700 ${isInviteValid ? 'opacity-100' : 'opacity-10 blur-sm pointer-events-none'}`}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl outline-none focus:border-violet-500 text-white font-bold" placeholder="FULL_NAME_ID"/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl outline-none focus:border-violet-500 text-white font-bold" placeholder="E_MAIL_ADDRESS"/>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl outline-none focus:border-violet-500 text-white font-bold" placeholder="KEY_1"/>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-8 py-5 bg-slate-950 border border-slate-800 rounded-3xl outline-none focus:border-violet-500 text-white font-bold" placeholder="KEY_2"/>
                    </div>
                    <Button type="submit" className="w-full h-20 !text-xl !font-black uppercase tracking-widest !rounded-[2rem] !bg-violet-600 shadow-2xl" disabled={loading || !isInviteValid}>
                        {loading ? <Spinner colorClass="bg-white"/> : 'Initialize Link'}
                    </Button>
                </form>
            </div>
          </div>

          <p className="mt-12 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
            Member? <Link to="/login" className="text-violet-500 hover:text-white underline transition-colors">Log In</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
