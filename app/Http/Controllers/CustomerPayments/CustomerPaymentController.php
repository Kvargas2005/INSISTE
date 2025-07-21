<?php

namespace App\Http\Controllers\CustomerPayments;

use App\Http\Controllers\Controller;
use App\Models\CustomerPayment;
use App\Models\Acta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class CustomerPaymentController extends Controller
{
    // Listado de pagos de cliente
    public function list(): Response
    {
        $payments = CustomerPayment::with(['acta.client', 'acta.creator'])
            ->orderByDesc('payment_date')
            ->get();

        $actas = Acta::with(['client', 'creator'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('CustomerPayment/list', [
            'payments' => $payments,
            'actas' => $actas,
        ]);
    }

    // Guardar un nuevo pago de cliente
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_acta' => 'required|exists:acta,id',
            'cliente_id' => 'nullable|integer',
            'voucher_number' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'transaction_type' => 'nullable|string|max:255',
            'receiver' => 'nullable|string|max:255',
            'payment_date' => 'required|date',
            'currency' => 'required|string|max:10',
            'amount' => 'required|numeric',
            'notes' => 'nullable|string',
            'is_total' => 'boolean',
            'linked_payment_id' => 'nullable|exists:customer_payments,id',
        ]);

        CustomerPayment::create($request->only([
            'id_acta',
            'cliente_id',
            'voucher_number',
            'reference',
            'document_number',
            'transaction_type',
            'receiver',
            'payment_date',
            'currency',
            'amount',
            'notes',
            'is_total',
            'linked_payment_id',
        ]));

        return to_route('customerPayments.list')->with('success', 'Pago registrado correctamente');
    }

    // Cambiar estado (ejemplo: pagado/no pagado, si aplica)
    public function toggleStatus(Request $request): RedirectResponse
    {
        $payment = CustomerPayment::findOrFail($request->input('id'));
        $payment->is_total = $request->input('status');
        $payment->save();
        return back()->with('success', 'Pago actualizado correctamente');
    }

    // Actualizar datos de un pago de cliente
    public function update(Request $request, $id): RedirectResponse
    {
        $payment = CustomerPayment::findOrFail($id);

        $request->validate([
            'id_acta' => 'required|exists:acta,id',
            'cliente_id' => 'nullable|integer',
            'voucher_number' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'transaction_type' => 'nullable|string|max:255',
            'receiver' => 'nullable|string|max:255',
            'payment_date' => 'required|date',
            'currency' => 'required|string|max:10',
            'amount' => 'required|numeric',
            'notes' => 'nullable|string',
            'is_total' => 'boolean',
            'linked_payment_id' => 'nullable|exists:customer_payments,id',
        ]);

        $payment->update($request->only([
            'id_acta',
            'cliente_id',
            'voucher_number',
            'reference',
            'document_number',
            'transaction_type',
            'receiver',
            'payment_date',
            'currency',
            'amount',
            'notes',
            'is_total',
            'linked_payment_id',
        ]));

        return to_route('customerPayments.list')->with('success', 'Pago actualizado correctamente');
    }

    // Obtener datos de un pago para edición
    public function fetch($id)
    {
        $payment = CustomerPayment::findOrFail($id);
        return response()->json([
            'data' => $payment
        ]);
    }

    // Eliminar un pago
    public function destroy($id): RedirectResponse
    {
        $payment = CustomerPayment::findOrFail($id);
        $payment->delete();
        return to_route('customerPayments.list')->with('success', 'Pago eliminado correctamente');
    }

    // Mostrar detalle/factura de pagos de una acta
    public function show($id): Response
    {
        $payment = CustomerPayment::with(['acta.client', 'acta.creator', 'relatedPayments'])
            ->findOrFail($id);
        $allPayments = CustomerPayment::where('id_acta', $payment->id_acta)->orderBy('payment_date')->get();
        return Inertia::render('CustomerPayment/show', [
            'payment' => $payment,
            'allPayments' => $allPayments,
        ]);
    }
}
