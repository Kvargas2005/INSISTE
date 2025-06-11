<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Role;
use App\Models\MainUser;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use App\Models\UserFile;
use Illuminate\Support\Facades\Storage;
use App\Models\Permission;


class UsersController extends Controller
{

    public function list(): Response
    {
        return Inertia::render('users/list', [
            'roles' => Role::select('id', 'name', 'color', 'text_color')->get(),
            'allUsers' => User::select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allAdmins' => User::where('id_role', 1)->select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allClients' => User::where('id_role', 2)->select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allTechnician' => User::where('id_role', 3)->select('id', 'name', 'email', 'id_role', 'deactivation_note', 'deactivation_date', 'status')->get(),
            'main_users' => MainUser::select([
                'id',
                'name',
                'description',
                'main_phone',
                'main_email',
                'registration_date',
                'status',
            ])->get(),
        ]);
    }


    public function createAdmin(): Response
    {
        return Inertia::render('users/new/admin', [
            'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
            'allUsers' => User::select('id', 'name', 'email', 'id_role', 'status')->get(), // Asegurate de usar el nombre correcto del campo
        ]);
    }
    public function createClient(): Response
    {
        return Inertia::render('users/new/client', [
            'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
            'allUsers' => User::select('id', 'name', 'email', 'id_role', 'status')->get(), // Asegurate de usar el nombre correcto del campo
            'main_users' => MainUser::select('id', 'name', 'description')->get(),
        ]);
    }
    public function createTecnico(): Response
    {
        return Inertia::render('users/new/tecnico', [
            'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
            'allUsers' => User::select('id', 'name', 'email', 'id_role', 'status')->get(), // Asegurate de usar el nombre correcto del campo
        ]);
    }

    public function getData($id)
    {
        $user = User::select('id', 'name', 'contact', 'adress', 'phone')
            ->where('id_role', 2)
            ->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'rol' => 'required|integer|in:1,2,3',
            'phone' => 'required|string|max:255',
            'provincia' => 'required|string|max:255',
            'canton' => 'required|string|max:255',
            'distrito' => 'required|string|max:255',
            'adress' => 'required|string|max:500',
            'specialization' => 'nullable|string|max:255',
            'technician_signature' => 'nullable|string',
            'code' => 'nullable|string|max:255|unique:users,code',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
            'driver_license' => 'nullable|string|max:255',
            'vehicle_brand' => 'nullable|string|max:255',
            'vehicle_plate' => 'nullable|string|max:255',
            'social_security' => 'nullable|string|max:255',
            'personal_email' => 'nullable|string|max:255',
            'tech_type' => 'nullable|string|max:255',
            'contact1_name' => 'nullable|string|max:255',
            'contact1_phone' => 'nullable|string|max:100',
            'contact1_email' => 'nullable|email|max:255',
            'contact2_name' => 'nullable|string|max:255',
            'contact2_phone' => 'nullable|string|max:100',
            'contact2_email' => 'nullable|email|max:255',
            'opening_hours' => 'nullable|string|max:100',
            'closing_hours' => 'nullable|string|max:100',


        ], [
            'name.unique' => 'El nombre ya está registrado',
            'email.unique' => 'El correo ya está registrado',
            'required' => 'Este campo es requerido',
            'files.*.mimes' => 'Los archivos deben ser PDF, Word, JPG o PNG',
            'files.*.max' => 'Cada archivo no debe superar los 2MB',
            'code.unique' => 'Este código ya está registrado',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'id_role' => $request->rol,
            'phone' => $request->phone,
            'provincia' => $request->provincia,
            'canton' => $request->canton,
            'distrito' => $request->distrito,
            'adress' => $request->adress,
            'hiringdate' => $request->hiringdate ?? null,
            'specialization' => $request->specialization ?? null,
            'tech_signature' => $request->technician_signature ?? null,
            'rut_nit' => $request->rut_nit ?? null,
            'contact' => $request->contact ?? null,
            'mails' => $request->mails ?? null,
            'code' => $request->code ?? null,
            'id_main_user' => $request->id_main_user != 0 ? $request->id_main_user : null,
            'driver_license' => $request->driver_license,
            'vehicle_brand' => $request->vehicle_brand,
            'vehicle_plate' => $request->vehicle_plate,
            'social_security' => $request->social_security,
            'personal_email' => $request->personal_email,
            'tech_type' => $request->tech_type,
            'contact1_name' => $request->contact1_name,
            'contact1_phone' => $request->contact1_phone,
            'contact1_email' => $request->contact1_email,
            'contact2_name' => $request->contact2_name,
            'contact2_phone' => $request->contact2_phone,
            'contact2_email' => $request->contact2_email,
            'opening_hours' => $request->opening_hours,
            'closing_hours' => $request->closing_hours,
        ]);

        switch ($user->id_role) {
            case 1: // Admin
                $user->permissions()->sync([1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53]); // Asignar permisos de administrador 
                break;
            case 2: // Local
                $user->permissions()->sync([38]); // Asignar permisos de local
                break;
            case 3: // Technician
                $user->permissions()->sync([12, 13, 14, 15, 16]); // Asignar permisos de técnico
                break;
        }

        // Guardar archivos
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('user_files'); // se guarda en storage/app/user_files
                UserFile::create([
                    'user_id' => $user->id,
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                ]);
            }
        }


        event(new Registered($user));

        // Redirigir según el rol
        if ($user->id_role == 3) {
            return to_route('users.listTechnicians')->with('success', 'Técnico creado correctamente');
        }
        if ($user->id_role == 2) {
            return to_route('users.listLocals')->with('success', 'Local creado correctamente');
        }
        if ($user->id_role == 1) {
            return to_route('users.listAdmin')->with('success', 'Administrador creado correctamente');
        }
        return to_route('users.list')->with('success', 'Usuario creado correctamente');
    }

    public function getTechCode(Request $request)
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
        ]);

        $stocks = User::where('id', $request->id_technician)
            ->get()
            ->map(function ($item) {
                return [
                    'code' => $item->code,
                    'signature' => $item->tech_signature,
                ];
            });

        return response()->json($stocks);
    }


    public function edit($id): Response
    {

        $user = User::findOrFail($id);

        if ($user->id_role == 1) {
            return Inertia::render('users/edit/admin', [
                'user' => $user,
                'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
            ]);
        }
        if ($user->id_role == 2) {
            return Inertia::render('users/edit/client', [
                'user' => $user,
                'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
                'main_users' => MainUser::select('id', 'name', 'description')->get(),
            ]);
        }
        if ($user->id_role == 3) {
            $user->load('files');
            return Inertia::render('users/edit/tecnico', [
                'user' => $user,
                'roles' => Role::select('id', 'name', 'color', 'text_color')->get(),
            ]);
        } else {
            return Inertia::render('users/edit/client', [
                'user' => $user,
                'roles' => Role::select('id', 'name', 'color', 'text_color')->get(), // Asegurate de usar el nombre correcto del campo
            ]);
        }
    }

    public function editSaveAdmin(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'name')->ignore($id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'rol' => 'required|integer|in:1,2,3',
            'phone' => 'required|string|max:255',
            'provincia' => 'required|string|max:255',
            'canton' => 'required|string|max:255',
            'distrito' => 'required|string|max:255',
            'adress' => 'required|string|max:500',
        ], [
            'name.unique' => 'El nombre ya está registrado',
            'email.unique' => 'El correo ya está registrado',
            'required' => 'Este campo es requerido',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'id_role' => $request->rol,
            'canton' => $request->canton,
            'provincia' => $request->provincia,
            'distrito' => $request->distrito,
            'adress' => $request->adress,
            'phone' => $request->phone,
        ]);

        return to_route('users.listAdmin')->with('success', 'Administrador actualizado correctamente');
    }

    public function editSaveTecnico(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'name')->ignore($id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'rol' => 'required|integer|in:1,2,3',
            'phone' => 'required|string|max:255',
            'provincia' => 'required|string|max:255',
            'canton' => 'required|string|max:255',
            'distrito' => 'required|string|max:255',
            'adress' => 'required|string|max:500',
            'specialization' => 'required|string|max:255',
            'tech_signature' => 'required|string',
            'hiringdate' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'code')->ignore($id),
            ],
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
            'driver_license' => 'nullable|string|max:255',
            'vehicle_brand' => 'nullable|string|max:255',
            'vehicle_plate' => 'nullable|string|max:255',
            'social_security' => 'nullable|string|max:255',
            'personal_email' => 'nullable|string|max:255',
            'tech_type' => 'nullable|string|max:255',
            'deleted_files' => 'array',
            'deleted_files.*' => 'integer|exists:user_files,id',
        ], [
            'name.unique' => 'El nombre ya está registrado',
            'email.unique' => 'El correo ya está registrado',
            'required' => 'Este campo es requerido',
            'files.*.mimes' => 'Los archivos deben ser PDF, Word, JPG o PNG',
            'files.*.max' => 'Cada archivo no debe superar los 2MB',
            'code.unique' => 'Este código ya está registrado',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'id_role' => $request->rol,
            'canton' => $request->canton,
            'provincia' => $request->provincia,
            'distrito' => $request->distrito,
            'adress' => $request->adress,
            'phone' => $request->phone,
            'specialization' => $request->specialization,
            'tech_signature' => $request->tech_signature,
            'hiringdate' => $request->hiringdate,
            'code' => $request->code,
            'driver_license' => $request->driver_license,
            'vehicle_brand' => $request->vehicle_brand,
            'vehicle_plate' => $request->vehicle_plate,
            'social_security' => $request->social_security,
            'personal_email' => $request->personal_email,
            'tech_type' => $request->tech_type,
        ]);

        // Eliminar archivos marcados para eliminar (físicamente y en BD)
        if ($request->filled('deleted_files')) {
            $filesToDelete = UserFile::whereIn('id', $request->deleted_files)->get();

            foreach ($filesToDelete as $file) {
                // Borra archivo físico
                if (Storage::disk('public')->exists($file->path)) {
                    Storage::disk('public')->delete($file->path);
                }
                // Borra registro en BD
                $file->delete();
            }
        }

        // Subir nuevos archivos si vienen
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('user_files', 'public');
                $user->files()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                ]);
            }
        }

        return to_route('users.listTechnicians')->with('success', 'Técnico actualizado correctamente');
    }




    public function editSaveClient(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'name')->ignore($id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'rol' => 'required|integer|in:1,2,3',
            'phone' => 'required|string|max:255',
            'provincia' => 'required|string|max:255',
            'canton' => 'required|string|max:255',
            'distrito' => 'required|string|max:255',
            'adress' => 'required|string|max:500',
            'mails' => 'required|string|max:255',
            'id_main_user' => 'required|integer',
            'hiringdate' => 'required|string|max:255',
            'rut_nit' => 'required|string|max:255',
            'contact1_name' => 'nullable|string|max:255',
            'contact1_phone' => 'nullable|string|max:100',
            'contact1_email' => 'nullable|email|max:255',
            'contact2_name' => 'nullable|string|max:255',
            'contact2_phone' => 'nullable|string|max:100',
            'contact2_email' => 'nullable|email|max:255',
            'opening_hours' => 'nullable|string|max:100',
            'closing_hours' => 'nullable|string|max:100',

        ], [
            'name.unique' => 'El nombre ya esta registrado',
            'email.unique' => 'El correo ya esta registrado',
            'required' => 'Este campo es requerido',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'id_role' => $request->rol,
            'canton' => $request->canton,
            'provincia' => $request->provincia,
            'distrito' => $request->distrito,
            'adress' => $request->adress,
            'phone' => $request->phone,
            'mails' => $request->mails,
            'id_main_user' => $request->id_main_user,
            'hiringdate' => $request->hiringdate,
            'rut_nit' => $request->rut_nit,
            'contact1_name' => $request->contact1_name,
            'contact1_phone' => $request->contact1_phone,
            'contact1_email' => $request->contact1_email,
            'contact2_name' => $request->contact2_name,
            'contact2_phone' => $request->contact2_phone,
            'contact2_email' => $request->contact2_email,
            'opening_hours' => $request->opening_hours,
            'closing_hours' => $request->closing_hours,

        ]);


        return to_route('users.listLocals')->with('success', 'Local actualizado correctamente');
    }

    public function toggleStatus(Request $request)
    {
        $user = User::findOrFail($request->id);
        $user->status = $request->status;
        if ($request->status == 2) { // Desactivar
            $user->deactivation_date = now();
            $user->deactivation_note = $request->deactivation_note ?? '';
        } else {
            $user->deactivation_date = null;
            $user->deactivation_note = null;
        }
        $user->save();

        // Redirigir según el rol
        if ($user->id_role == 3) {
            return to_route('users.listTechnicians')->with('success', 'Estado actualizado');
        }
        if ($user->id_role == 2) {
            return to_route('users.listLocals')->with('success', 'Estado actualizado');
        }
        if ($user->id_role == 1) {
            return to_route('users.listAdmin')->with('success', 'Estado actualizado');
        }
        return back();
    }

    public function listClients(): Response
    {
        return Inertia::render('users/listClient', [
            'main_users' => \App\Models\MainUser::select('id', 'name', 'main_phone', 'main_email', 'registration_date', 'status')->get(),
            'roles' => Role::select('id', 'name', 'color', 'text_color')->get(),
            'allUsers' => User::select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allAdmins' => User::where('id_role', 1)->select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allClients' => User::where('id_role', operator: 2)->select('id', 'name', 'email', 'id_role', 'status')->get(),
            'allTechnician' => User::where('id_role', 3)->select('id', 'name', 'email', 'id_role', 'status')->get(),
        ]);
    }


    public function listLocals(): Response
    {
        return Inertia::render('users/ListLocal', [
            'allClients' => User::where('id_role', 2)
                ->select('id', 'name', 'email', 'id_role', 'status')
                ->get(),
        ]);
    }

    public function listTechnicians(): \Inertia\Response
    {
        return Inertia::render('users/ListTechnician', [
            'allTechnician' => User::where('id_role', 3)
                ->select('id', 'name', 'email', 'id_role', 'status', 'deactivation_note', 'deactivation_date')
                ->get(),
        ]);
    }

    public function showPermissions($id)
    {
        $user = User::with('permissions')->findOrFail($id);
        $permissions = \App\Models\Permission::select('id', 'name', 'description', 'main')->get();
        return inertia('users/assignPermissions', [
            'user' => $user,
            'permissions' => $permissions,
        ]);
    }

    public function assignPermissions(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);
        $user->permissions()->sync($request->permissions ?? []);
        return redirect()->route('users.showPermissions', $user->id)->with('success', 'Permisos actualizados');
    }

    public function listAdmin(): Response
    {
        return Inertia::render('users/listAdmin', [
            'allAdmins' => User::where('id_role', 1)->select('id', 'name', 'email', 'id_role', 'status')->get(),
        ]);
    }
}
