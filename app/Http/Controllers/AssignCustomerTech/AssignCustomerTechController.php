<?php

namespace App\Http\Controllers\AssignCustomerTech;

use App\Http\Controllers\Controller;
use App\Models\AssignCustomerTech;
use App\Models\User;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;



class AssignCustomerTechController extends Controller
{
    public function list(): Response
    {
        $customers = User::leftJoin('main_user as main', 'users.id_main_user', '=', 'main.id')
            ->leftJoin('assign_customer_tech as act', function ($join) {
                $join->on('users.id', '=', 'act.id_customer')
                    ->whereIn('act.tech_status', [1, 2]) // pendiente o en curso
                    ->where('act.status', 1);
            })
            ->select(
                'users.id',
                'users.name',
                'users.phone',
                'main.name as parent_company',
                \DB::raw("CASE WHEN act.id IS NOT NULL THEN 'Asignado' ELSE 'Sin asignar' END as status_label"),
                \DB::raw("CASE 
                        WHEN act.assign_date IS NOT NULL AND act.tech_status IN (1,2) 
                        AND act.assign_date < CURDATE() 
                        THEN 1 ELSE 0 
                      END as is_late")
            )
            ->where('users.id_role', 2)
            ->groupBy('users.id', 'users.name', 'users.phone', 'main.name', 'act.id', 'act.assign_date', 'act.tech_status')
            ->get();

        $technicians = User::where('id_role', 3)
            ->select('id', 'name')
            ->get();

        $services = Service::select('id', 'description')->where('status', 1)->get();
        return Inertia::render('assignCustomerTech/list', [
            'customers' => $customers,
            'technicians' => $technicians,
            'services' => $services,
        ]);
    }


    public function view()
    {
        $assignments = AssignCustomerTech::with(['technician', 'customer', 'services'])
            ->select('id', 'id_technician', 'id_customer', 'assign_date', 'tech_status', 'start_date', 'end_date', 'status', 'comments') // ← agrega 'status'
            ->get();


        $customers = \App\Models\User::where('id_role', 2)
            ->select('id', 'name')
            ->get();

        $technicians = \App\Models\User::where('id_role', 3)
            ->select('id', 'name')
            ->get();

        $services = Service::select('id', 'description')->where('status', 1)->get();
        return Inertia::render('assignCustomerTech/view', [
            'assignments' => $assignments,
            'customers' => $customers,
            'technicians' => $technicians,
            'services' => $services,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
            'alert_days' => 'required|integer|min:0',
            'selectedCustomers' => 'required|array|min:1',
            'selectedCustomers.*' => 'exists:users,id',
            'assign_date' => 'nullable|date',
            'comments' => 'nullable|string|max:255',
            'services' => 'nullable|array',
            'services.*' => 'exists:service,id',
        ]);

        $request->merge([
            'services' => is_array($request->services) ? $request->services : (is_string($request->services) ? array_filter(explode(',', $request->services)) : [])
        ]);

        foreach ($request->selectedCustomers as $customerId) {
            $assignment = AssignCustomerTech::create([
                'id_technician' => $request->id_technician,
                'id_customer' => $customerId,
                'assign_date' => $request->assign_date ?? now(),
                'alert_days' => $request->alert_days,
                'tech_status' => 1,
                'status' => 1,
                'comments' => $request->comments, 
            ]);
            if ($request->has('services')) {
                $assignment->services()->sync($request->services);
            }
        }

        return to_route('assignCustomerTech.list')->with('success', 'Clientes asignados correctamente.');
    }


    public function fetchAssignment($id)
    {
        $assignment = AssignCustomerTech::with('services')->findOrFail($id);
        return response()->json([
            'data' => [
                'id_technician' => $assignment->id_technician,
                'id_customer' => $assignment->id_customer,
                'comments' => $assignment->comments,
                'alert_days' => $assignment->alert_days,
                'assign_date' => $assignment->assign_date ? date('Y-m-d\TH:i', strtotime($assignment->assign_date)) : null,
                'services' => $assignment->services->pluck('id')->toArray(),
            ]
        ]);
    }

    public function editAssignment(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
            'id_customer' => 'required|exists:users,id',
            'comments' => 'nullable|string|max:255',
            'alert_days' => 'nullable|integer|min:0',
            'assign_date' => 'required|date',
        ]);

        $request->merge([
            'services' => is_array($request->services) ? $request->services : (is_string($request->services) ? array_filter(explode(',', $request->services)) : [])
        ]);
        $assignment = AssignCustomerTech::findOrFail($id);
        $assignment->update([
            'id_technician' => $request->id_technician,
            'id_customer' => $request->id_customer,
            'comments' => $request->comments,
            'alert_days' => $request->alert_days,
            'assign_date' => $request->assign_date,
        ]);
        if ($request->has('services')) {
            $assignment->services()->sync($request->services);
        }
        return to_route('assignCustomerTech.view')->with('success', 'Asignación actualizada correctamente.');
    }

    public function toggleStatus(Request $request): RedirectResponse
    {
        $assignment = AssignCustomerTech::findOrFail($request->id);

        $assignment->update([
            'status' => $assignment->status === 1 ? 2 : 1, // 2 = cancelado
        ]);

        return back()->with('success', 'Asignación actualizada correctamente.');
    }

    public function viewTech()
    {
        $user = Auth::user();

        $assignments = AssignCustomerTech::with(['customer'])
            ->where('id_technician', $user->id)
            ->orderByDesc('assign_date')
            ->get(['id', 'id_customer', 'assign_date', 'start_date', 'tech_status', 'status', 'comments']);

        $assignments->load('customer:id,name');

        return Inertia::render('assignCustomerTech/viewTech', [
            'assignments' => $assignments
        ]);
    }




}
