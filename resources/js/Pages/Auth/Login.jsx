import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans selection:bg-[#CCFF00] selection:text-black">
            <Head title="Acesso ao Sistema" />

            <div className="w-full max-w-md relative">
                {/* Decorative Elements - Brutalist */}
                <div className="absolute -top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-[#CCFF00]/20 pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-24 h-24 border-b-2 border-r-2 border-[#CCFF00]/20 pointer-events-none"></div>
                
                <div className="border-2 border-[#27272a] bg-[#09090b] shadow-[20px_20px_0px_0px_rgba(39,39,42,0.5)] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#18181b] border-b-2 border-[#27272a] p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-mono text-[10px] text-[#CCFF00] tracking-[0.3em] uppercase">
                                Autenticação // Módulo de Segurança
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-red-500/50"></div>
                                <div className="w-2 h-2 bg-yellow-500/50"></div>
                                <div className="w-2 h-2 bg-green-500/50"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                            FlipForge <span className="text-[#CCFF00]">Cost_</span>
                        </h1>
                    </div>

                    <div className="p-8">
                        {status && (
                            <div className="mb-6 p-4 border border-green-500/20 bg-green-500/5 text-green-500 font-mono text-xs uppercase tracking-widest">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Credencial de Acesso" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full border-2"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="USUARIO@FLIPFORGE.ON"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <InputLabel htmlFor="password" value="Senha do Operador" />
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[10px] uppercase font-bold text-zinc-500 hover:text-[#CCFF00] tracking-widest transition-colors"
                                        >
                                            Esqueci a senha?
                                        </Link>
                                    )}
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full border-2"
                                    autoComplete="current-password"
                                    placeholder="********"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    className="rounded-none bg-[#09090b] border-2 border-[#27272a] text-[#CCFF00] focus:ring-[#CCFF00] focus:ring-offset-[#09090b]"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="ms-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                    Manter sessão ativa
                                </label>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                <PrimaryButton className="w-full justify-center h-12 text-sm" disabled={processing}>
                                    Acessar Sistema [ENTER]
                                </PrimaryButton>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#27272a]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 bg-[#09090b] px-4">
                                        Ou acesse via parceiro
                                    </div>
                                </div>

                                <a
                                    href={route('auth.google')}
                                    className="w-full flex items-center justify-center gap-3 h-12 border-2 border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs font-bold uppercase tracking-widest text-white transition-all group"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Google Auth Terminal
                                </a>
                            </div>
                        </form>
                    </div>

                    <div className="bg-[#18181b] border-t-2 border-[#27272a] p-4 text-center">
                        <Link
                            href={route('register')}
                            className="text-[10px] font-bold text-zinc-500 hover:text-[#CCFF00] uppercase tracking-widest transition-colors"
                        >
                            Não possui credenciais? <span className="text-white border-b border-white hover:border-[#CCFF00]">Solicitar Acesso_</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
