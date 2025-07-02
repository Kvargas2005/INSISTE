<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Acta;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function list(): Response
    {
        $payments = Payment::with(['acta' => function($q) {
            $q->select('id', 'code', 'id_created_by', 'created_at')
              ->with(['creator:id,name']);
        }])
        ->select('id', 'id_acta', 'amount_paid', 'concept', 'notes', 'payment_date')
        ->get();

        $actas = Acta::select('id', 'code', 'id_created_by', 'id_for', 'created_at')
            ->with(['creator:id,name', 'client:id,name'])
            ->get();

        return Inertia::render('payments/list', [
            'payments' => $payments,
            'actas' => $actas,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_acta' => 'required|exists:acta,id',
            'amount_paid' => 'required|numeric',
            'concept' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'payment_date' => 'required|date',
        ]);

        Payment::create($request->only('id_acta', 'amount_paid', 'concept', 'notes', 'payment_date'));

        return back()->with('success', 'Pago registrado correctamente.');
    }

    public function fetch($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json(['data' => $payment]);
    }

    public function edit(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'id_acta' => 'required|exists:acta,id',
            'amount_paid' => 'required|numeric',
            'concept' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'payment_date' => 'required|date',
        ]);

        $payment = Payment::findOrFail($id);
        $payment->update($request->only('id_acta', 'amount_paid', 'concept', 'notes', 'payment_date'));

        return to_route('payments.list')->with('success', 'Pago actualizado correctamente.');
    }
}
