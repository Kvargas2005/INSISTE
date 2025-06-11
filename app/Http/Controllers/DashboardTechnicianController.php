<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AssignCustomerTech;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\VerificationCode;

class DashboardTechnicianController extends Controller
{
    // Vista principal del técnico
    public function index()
{
    $user = Auth::user();

    if ($user->id_role !== 3) {
        abort(403, 'No autorizado');
    }

    $assignments = AssignCustomerTech::with('customer')
    ->where('id_technician', $user->id)
    ->where('status', 1)             // Activas
    ->whereIn('tech_status', [1, 2]) // Pendientes y en curso
    ->select('id', 'id_customer', 'assign_date', 'tech_status')
    ->get()
    ->map(function ($a) {
        return [
            'id' => $a->id,
            'assign_date' => $a->assign_date,
            'customer_name' => $a->customer->name,
            'tech_status' => $a->tech_status,
        ];
    });


    return Inertia::render('dashboard/DashboardTechnician', [
        'assignments' => $assignments,
    ]);
}


    // Acción para iniciar el trabajo
public function start(Request $request)
{
    $request->validate([
        'assignment_id' => 'required|exists:assign_customer_tech,id',
        'verification_code' => 'required|string|size:4',
    ]);

    $assignment = AssignCustomerTech::findOrFail($request->assignment_id);

    // Verificar que el técnico sea el asignado
    if ($assignment->id_technician !== Auth::id()) {
        return back()->withErrors(['assignment_id' => 'No autorizado'])->withInput();
    }

    // Verificar el código de verificación del cliente
    $validCode = VerificationCode::where('id_user', $assignment->id_customer)
        ->where('code', $request->verification_code)
        ->where('expires_at', '>', Carbon::now())
        ->latest()
        ->first();

    if (!$validCode) {
        return back()->withErrors(['verification_code' => 'Código inválido o expirado'])->withInput();
    }

    // Iniciar la tarea si aún no tiene fecha de inicio
    if (!$assignment->start_date) {
        $assignment->start_date = now();
        $assignment->tech_status = 2; // En curso
        $assignment->save();
    }

    return redirect()->back()->with('success', 'Trabajo iniciado correctamente.');
}


    // (Opcional) Si necesitas obtener las asignaciones por AJAX en otro momento
    public function fetchAssignmentsByTechnician()
    {
        $assignments = AssignCustomerTech::with('customer')
            ->where('id_technician', Auth::id())
            ->where('status', 1)
            ->whereIn('tech_status', [1, 2])
            ->get(['id', 'id_customer']);

        $data = $assignments->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->customer->name,
            ];
        });

        return response()->json($data);
    }
}
