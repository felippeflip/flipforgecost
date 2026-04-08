import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ users }) {
    const { patch, delete: destroy, processing } = useForm();

    const handleRoleUpdate = (user, newRole) => {
        if (confirm(`Deseja alterar o perfil de ${user.name} para ${newRole}?`)) {
            patch(route('admin.users.update-role', { 
                user: user.id,
                role: newRole,
                status: user.status 
            }));
        }
    };

    const handleStatusUpdate = (user, newStatus) => {
        if (confirm(`Deseja alterar o status de ${user.name} para ${newStatus}?`)) {
            patch(route('admin.users.update-role', { 
                user: user.id,
                role: user.role,
                status: newStatus 
            }));
        }
    };

    const handleDelete = (user) => {
        if (confirm(`Tem certeza que deseja remover ${user.name}? Esta ação não pode ser desfeita.`)) {
            destroy(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AppLayout
            header="GESTÃO DE ACESSOS // ADMIN"
        >
            <Head title="Gestão de Usuários" />

            <div className="space-y-6">
                <div className="border border-[#27272a] bg-[#09090b]">
                    <div className="p-4 border-b border-[#27272a] bg-[#0f0f11]">
                        <h2 className="text-sm font-mono tracking-widest text-[#CCFF00] uppercase">Mesa de Operadores</h2>
                    </div>
                    <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-sm">
                                    <thead className="border-b border-[#27272a] bg-[#0f0f11] uppercase text-zinc-500 text-[10px] tracking-widest">
                                        <tr>
                                            <th className="px-6 py-3">Nome</th>
                                            <th className="px-6 py-3">E-mail</th>
                                            <th className="px-6 py-3">Perfil</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Endereço</th>
                                            <th className="px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-[#27272a] hover:bg-[#18181b] transition-colors">
                                                <td className="px-6 py-4 text-white font-bold">{user.name}</td>
                                                <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        value={user.role} 
                                                        onChange={(e) => handleRoleUpdate(user, e.target.value)}
                                                        className="bg-[#09090b] border-[#27272a] text-[#CCFF00] text-[10px] rounded-none focus:ring-0 uppercase tracking-widest py-1"
                                                        disabled={processing || user.email === 'felippe.flip@gmail.com'}
                                                    >
                                                        <option value="user">Convencional</option>
                                                        <option value="admin">Administrador</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        value={user.status} 
                                                        onChange={(e) => handleStatusUpdate(user, e.target.value)}
                                                        className={`bg-[#09090b] border-[#27272a] text-[10px] rounded-none focus:ring-0 uppercase tracking-widest py-1 ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}
                                                        disabled={processing || user.email === 'felippe.flip@gmail.com'}
                                                    >
                                                        <option value="active">Ativo</option>
                                                        <option value="inactive">Inativo</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-[10px] leading-tight text-zinc-500">
                                                    {user.address ? (
                                                        <>
                                                            {user.address}, {user.number}
                                                            <br />
                                                            {user.city} - {user.state}
                                                        </>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.email !== 'felippe.flip@gmail.com' && (
                                                        <button 
                                                            onClick={() => handleDelete(user)}
                                                            className="text-red-500 hover:text-red-400 font-black text-[10px] uppercase tracking-widest border border-red-500/20 px-2 py-1 hover:bg-red-500/5 transition-all"
                                                            disabled={processing}
                                                        >
                                                            Eliminar_
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}
