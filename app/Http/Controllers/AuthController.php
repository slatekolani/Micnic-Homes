<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();

            $request->session()->regenerate();

            return in_array($user->role, ['admin', 'owner'])
                ? redirect()->route('owner.index')
                : redirect()->route('home');
        }

        return back()->withErrors(['email' => 'These credentials do not match our records.']);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email',
            'phone'    => 'nullable|string|max:30',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:guest,owner',
        ]);

        $user = User::create($data);

        Auth::login($user);
        $request->session()->regenerate();

        return $user->isOwner()
            ? redirect()->route('owner.index')->with('success', 'Account created. You can start listing properties now.')
            : redirect()->route('home')->with('success', 'Account created successfully.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
