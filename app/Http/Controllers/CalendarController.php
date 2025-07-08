<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\AssignCustomerTech;

class CalendarController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // Si es admin, ve todas las asignaciones. Si es técnico, solo las suyas.
        $query = AssignCustomerTech::with(['customer', 'technician']);
        if ($user->id_role == 3) {
            $query->where('id_technician', $user->id);
        }
        $assignments = $query->get(['id', 'id_customer', 'id_technician', 'assign_date', 'start_date', 'end_date', 'tech_status', 'status', 'comments']);

        $assignments = $assignments->map(function ($a) {
            return [
                'id' => $a->id,
                'title' => $a->customer->name . ' - ' . $a->technician->name,
                'start' => $a->assign_date,
                'end' => $a->end_date ?? $a->assign_date,
                'allDay' => false,
                'status' => $a->tech_status,
                'comments' => $a->comments,
            ];
        });

        return Inertia::render('calendar/calendar', [
            'assignments' => $assignments,
        ]);
    }
}
