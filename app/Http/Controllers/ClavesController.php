<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use BcMath\Number;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Key;
use App\Models\User;
use Illuminate\Http\Request;

class ClavesController extends Controller
{


    public function list(): Response
    {
        return Inertia::render('claves/list', [
            'allKeys' => Key::select('id', 'description', 'key_type', 'id_user', 'status')->get(), // Asegurate de usar el nombre correcto del campo
            'users' => User::where('id_role', 2)->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'key_type' => 'required|integer',
            'id_user' => 'required|integer',
        ]);
        $key = new Key();
        $key->description = $request->description;
        $key->key_type = $request->key_type;
        $key->id_user = $request->id_user;

        $key->save();

        return to_route('claves.list')->with('success', 'Clave creada correctamente');
    }

    public function edit($id, Request $request): RedirectResponse
    {

        $key = Key::findOrFail($id);

        $request->validate([
            'description' => 'required|string|max:255',
            'key_type' => 'required|integer',
            'id_user' => 'required|integer',
        ]);

        $key->update([
            'description' => $request->description,
            'key_type' => $request->key_type,
            'id_user' => $request->id_user,
        ]);

        return to_route('claves.list')->with('success', 'Clave editada correctamente');
    }

    public function fetch($id)
    {
        // Buscar el usuario por ID
        $Key = Key::findOrFail($id);

        // Devolver los datos usando Inertia
        return response()->json([
            'data' => [
                'id' => $id,
                'description' => $Key->description,
                'key_type' => $Key->key_type,
                'id_user' => $Key->id_user,
            ]
        ]);
    }
}

