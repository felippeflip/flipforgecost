<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::latest()->get(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        // Apenas o felippe.flip@gmail.com ou outros admins (se houver) podem mudar roles
        // Mas a regra específica do usuário é que apenas ELE pode mudar dos outros.
        if (auth()->user()->email !== 'felippe.flip@gmail.com') {
            return back()->with('error', 'Apenas o administrador mestre pode alterar perfis.');
        }

        $request->validate([
            'role' => 'required|in:admin,user',
            'status' => 'required|in:active,inactive',
        ]);

        $user->update([
            'role' => $request->role,
            'status' => $request->status,
        ]);

        return back()->with('success', 'Usuário atualizado com sucesso.');
    }

    public function destroy(User $user)
    {
        if ($user->email === 'felippe.flip@gmail.com') {
            return back()->with('error', 'O administrador mestre não pode ser removido.');
        }

        $user->delete();

        return back()->with('success', 'Usuário removido com sucesso.');
    }
}
