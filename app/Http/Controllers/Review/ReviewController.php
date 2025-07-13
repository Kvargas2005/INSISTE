<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Acta;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    // Guardar una review
    public function store(Request $request)
    {
        $request->validate([
            'id_technician' => 'required|exists:users,id',
            'id_acta' => 'required|exists:acta,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Evitar duplicados por cliente/acta
        $exists = Review::where('id_acta', $request->id_acta)->where('id_technician', $request->id_technician)->exists();
        if ($exists) {
            return to_route('reviews.my')->with('error', 'Ya calificaste esta visita.');
        }

        $review = Review::create([
            'id_technician' => $request->id_technician,
            'id_acta' => $request->id_acta,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 1,
        ]);

        return to_route('reviews.my')->with('success', 'Reseña enviada correctamente.');
    }

    // Listar reviews para admin
    public function index(Request $request)
    {
        $reviews = Review::with(['technician', 'acta'])
            ->orderByDesc('id')
            ->get();
        // Obtener todos los técnicos con al menos una review
        $technicians = \App\Models\User::where('id_role', 3)
            ->whereIn('id', $reviews->pluck('id_technician')->unique())
            ->select('id', 'name')
            ->get();
        return Inertia::render('reviews/techReviews', [
            'reviews' => $reviews,
            'technicians' => $technicians,
        ]);
    }

    public function myReviews()
    {
        $user = Auth::user();
        if ($user->id_role !== 2) abort(403);

        // Actas del cliente
        $actas = \App\Models\Acta::with(['creator'])
            ->where('id_for', $user->id)
            ->get();

        // Reviews hechas por el cliente
        $reviews = \App\Models\Review::whereIn('id_acta', $actas->pluck('id'))
            ->get();

        // Actas ya reseñadas
        $reviewedActaIds = $reviews->pluck('id_acta')->toArray();
        $reviewed = $reviews->map(function($r) use ($actas) {
            $acta = $actas->firstWhere('id', $r->id_acta);
            return [
                'id' => $r->id,
                'id_acta' => $r->id_acta,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'technicianName' => $acta && $acta->creator ? $acta->creator->name : '',
                'fechaVisita' => $acta ? $acta->start_time : null,
            ];
        });
        // Actas pendientes
        $pending = $actas->filter(fn($a) => !in_array($a->id, $reviewedActaIds))
            ->map(function($a) {
                return [
                    'id' => $a->id,
                    'code' => $a->code,
                    'start_time' => $a->start_time,
                    'creator' => [ 'id' => $a->creator->id, 'name' => $a->creator->name ],
                    'technicianName' => $a->creator ? $a->creator->name : '',
                    'fechaVisita' => $a->start_time,
                ];
            })
            ->values();

        // Buscar la acta pendiente más reciente dentro de las últimas 24 horas
        $now = now();
        $pendingRecent = $pending->filter(function($a) use ($now) {
            if (!$a['fechaVisita']) return false;
            $fecha = \Carbon\Carbon::parse($a['fechaVisita']);
            return $fecha->between($now->copy()->subHours(24), $now);
        })->sortByDesc('fechaVisita')->first();

        return Inertia::render('reviews/MyReviews', [
            'reviewed' => $reviewed,
            'pending' => $pending,
            'pendingRecent' => $pendingRecent,
            'flashError' => session('error'),
        ]);
    }

    public function detailTech($id)
    {
        $user = auth()->user();
        if ($user->id_role != 1) {
            abort(403, 'Solo el administrador puede ver las reseñas de los técnicos.');
        }
        $technician = \App\Models\User::where('id', $id)->where('id_role', 3)->first();
        if (!$technician) {
            abort(404, 'Técnico no encontrado.');
        }
        $reviews = \App\Models\Review::with(['acta', 'acta.customer'])
            ->where('id_technician', $id)
            ->orderByDesc('id')
            ->get()
            ->map(function($r) {
                return [
                    'id' => $r->id,
                    'id_technician' => $r->id_technician,
                    'id_acta' => $r->id_acta,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'status' => $r->status,
                    'created_at' => $r->created_at,
                    'acta' => $r->acta ? [
                        'id' => $r->acta->id,
                        'code' => $r->acta->code,
                        'customer' => $r->acta->customer ? [
                            'id' => $r->acta->customer->id,
                            'name' => $r->acta->customer->name
                        ] : null
                    ] : null,
                ];
            });
        return Inertia::render('reviews/detailTech', [
            'technician' => [
                'id' => $technician->id,
                'name' => $technician->name,
            ],
            'reviews' => $reviews,
        ]);
    }
}
