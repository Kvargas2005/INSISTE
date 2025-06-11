<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\AssignCustomerTech;

class DashboardController extends Controller
{
   public function index()
{
    $user = Auth::user();

    $assignments = [];
    $activeAssignment = null;

    if ($user->id_role === 3) {
        $assignments = AssignCustomerTech::with('customer')
            ->where('id_technician', $user->id)
            ->where('status', 1)
            ->whereIn('tech_status', [1, 2]) // pendiente o en curso
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'assign_date' => $a->assign_date,
                'customer_name' => $a->customer->name,
                'tech_status' => $a->tech_status,
            ]);

        $activeModel = AssignCustomerTech::with('customer')
            ->where('id_technician', $user->id)
            ->where('status', 1)
            ->where('tech_status', 2)
            ->first();

        if ($activeModel) {
            $activeAssignment = [
                'id' => $activeModel->id,
                'assign_date' => $activeModel->assign_date,
                'start_date' => $activeModel->start_date,
                'customer_name' => $activeModel->customer->name,
                'tech_status' => $activeModel->tech_status,
            ];
        }
    }

    return Inertia::render('dashboard', [
        'assignments' => $assignments,
        'activeAssignment' => $activeAssignment,
    ]);
}

}
