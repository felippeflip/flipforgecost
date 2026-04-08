import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        zip_code: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    const [searchingCep, setSearchingCep] = useState(false);

    const handleCepSearch = async () => {
        const cep = data.zip_code.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setSearchingCep(true);
        try {
            // Tentativa 1: ViaCEP
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.data.erro) {
                    setData({
                        ...data,
                        address: response.data.logradouro,
                        neighborhood: response.data.bairro,
                        city: response.data.localidade,
                        state: response.data.uf,
                    });
                    setSearchingCep(false);
                    return;
                }
            } catch (e) {
                console.warn('ViaCEP falhou, tentando fallback...');
            }

            // Tentativa 2: BrasilAPI (Fallback)
            const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
            setData({
                ...data,
                address: response.data.street,
                neighborhood: response.data.neighborhood,
                city: response.data.city,
                state: response.data.state,
            });
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Não foi possível encontrar o CEP automaticamente. Por favor, preencha manualmente.');
        } finally {
            setSearchingCep(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 font-sans selection:bg-[#CCFF00] selection:text-black">
            <Head title="Solicitação de Acesso" />

            <div className="w-full max-w-2xl relative my-12">
                {/* Decorative Elements - Brutalist */}
                <div className="absolute -top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-[#CCFF00]/20 pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-24 h-24 border-b-2 border-r-2 border-[#CCFF00]/20 pointer-events-none"></div>
                
                <div className="border-2 border-[#27272a] bg-[#09090b] shadow-[20px_20px_0px_0px_rgba(39,39,42,0.5)] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#18181b] border-b-2 border-[#27272a] p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-mono text-[10px] text-[#CCFF00] tracking-[0.3em] uppercase">
                                Registro // Nova Credencial
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-zinc-800"></div>
                                <div className="w-2 h-2 bg-zinc-700"></div>
                                <div className="w-2 h-2 bg-zinc-600"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                            Nova Inscrição<span className="text-[#CCFF00]">_</span>
                        </h1>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <Link
                                href="/auth/google/redirect"
                                className="w-full flex items-center justify-center gap-3 h-12 border-2 border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-xs font-bold uppercase tracking-widest text-white transition-all group"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Rastrear via Google Profile
                            </Link>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-[#27272a]"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 bg-[#09090b] px-4">
                                    Ou preencha o dossiê manual
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nome do Operador" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-2 block w-full border-2"
                                        autoComplete="name"
                                        isFocused={true}
                                        placeholder="NOME COMPLETO"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="E-mail Corporativo" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full border-2"
                                        autoComplete="username"
                                        placeholder="EXEMAILO@DOMINIO.COM"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                            </div>

                            <div className="border-l-2 border-[#CCFF00] pl-6 py-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <InputLabel htmlFor="zip_code" value="CEP de Origem" />
                                        <div className="flex mt-2">
                                            <TextInput
                                                id="zip_code"
                                                value={data.zip_code}
                                                className="block w-full border-2"
                                                onChange={(e) => setData('zip_code', e.target.value)}
                                                onBlur={handleCepSearch}
                                                placeholder="00000-000"
                                                required
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleCepSearch}
                                                className="bg-[#27272a] px-4 border-2 border-l-0 border-[#27272a] text-[#CCFF00] hover:bg-[#3f3f46] transition-colors"
                                                disabled={searchingCep}
                                            >
                                                {searchingCep ? '...' : '→'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="address" value="Logradouro" />
                                        <TextInput
                                            id="address"
                                            value={data.address}
                                            className="mt-2 block w-full border-2"
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="RUA / AVENIDA / ALAMEDA"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel htmlFor="number" value="Número" />
                                        <TextInput
                                            id="number"
                                            value={data.number}
                                            className="mt-2 block w-full border-2"
                                            onChange={(e) => setData('number', e.target.value)}
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="neighborhood" value="Bairro" />
                                        <TextInput
                                            id="neighborhood"
                                            value={data.neighborhood}
                                            className="mt-2 block w-full border-2"
                                            onChange={(e) => setData('neighborhood', e.target.value)}
                                            placeholder="ZONA CENTRAL"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="state" value="UF" />
                                        <TextInput
                                            id="state"
                                            value={data.state}
                                            className="mt-2 block w-full border-2"
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="SP"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="city" value="Cidade" />
                                        <TextInput
                                            id="city"
                                            value={data.city}
                                            className="mt-2 block w-full border-2"
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="SÃO PAULO"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="complement" value="Complemento (Opcional)" />
                                        <TextInput
                                            id="complement"
                                            value={data.complement}
                                            className="mt-2 block w-full border-2"
                                            placeholder="APT / BLOCO / SALA"
                                            onChange={(e) => setData('complement', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="password" value="Criar Senha" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full border-2"
                                        autoComplete="new-password"
                                        placeholder="********"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirmar Assinatura" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-2 block w-full border-2"
                                        autoComplete="new-password"
                                        placeholder="********"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            <div className="pt-6">
                                <PrimaryButton className="w-full justify-center h-14 text-sm" disabled={processing}>
                                    Confirmar Inscrição [EXECUTE]
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="bg-[#18181b] border-t-2 border-[#27272a] p-6 text-center">
                        <Link
                            href={route('login')}
                            className="text-[10px] font-bold text-zinc-500 hover:text-[#CCFF00] uppercase tracking-widest transition-colors"
                        >
                            Já possui credenciais? <span className="text-white border-b border-white hover:border-[#CCFF00]">Fazer Login_</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
