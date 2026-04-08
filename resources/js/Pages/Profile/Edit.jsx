import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout
            header="CONFIGURAÇÕES DE PERFIL // 01"
        >
            <Head title="Profile" />

            <div className="space-y-8">
                <div className="border border-[#27272a] bg-[#09090b]">
                    <div className="p-4 border-b border-[#27272a] bg-[#0f0f11]">
                        <h2 className="text-sm font-mono tracking-widest text-[#CCFF00] uppercase">Informações da Conta</h2>
                    </div>
                    <div className="p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </div>

                <div className="border border-[#27272a] bg-[#09090b]">
                    <div className="p-4 border-b border-[#27272a] bg-[#0f0f11]">
                        <h2 className="text-sm font-mono tracking-widest text-[#CCFF00] uppercase">Segurança da Senha</h2>
                    </div>
                    <div className="p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>

                <div className="border border-red-500/20 bg-[#09090b]">
                    <div className="p-4 border-b border-red-500/20 bg-red-500/5">
                        <h2 className="text-sm font-mono tracking-widest text-red-500 uppercase">Zona de Perigo</h2>
                    </div>
                    <div className="p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
