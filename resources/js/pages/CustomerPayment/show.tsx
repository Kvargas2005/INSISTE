import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface CustomerPaymentDetailProps {
    payment: any;
    allPayments: any[];
}

export default function CustomerPaymentShow({ payment, allPayments }: CustomerPaymentDetailProps) {

    // Encuentra todos los pagos ligados a este grupo (padre e hijos), evitando ciclos
    function getLinkedPayments(basePayment: any, all: any[]): any[] {
        // Encuentra el padre raíz
        let root = basePayment;
        const visited = new Set();
        while (root.linked_payment_id) {
            if (visited.has(root.id)) break;
            visited.add(root.id);
            const parent = all.find(p => p.id === root.linked_payment_id);
            if (!parent) break;
            root = parent;
        }
        // Recorre todos los hijos en cadena, evitando ciclos
        const chain: any[] = [];
        let current = root;
        const visitedChain = new Set();
        while (current) {
            if (visitedChain.has(current.id)) break;
            visitedChain.add(current.id);
            chain.push(current);
            const next = all.find(p => p.linked_payment_id === current.id);
            if (!next) break;
            current = next;
        }
        return chain;
    }

    const linkedPayments = getLinkedPayments(payment, allPayments);

    return (
        <AppLayout breadcrumbs={[{ title: 'Pagos de Cliente', href: '/customerPayments' }, { title: `Factura Detallada`, href: '#' }]}>            
            <Head title={`Factura Detallada`} />
            <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
                <h1 className="text-2xl font-bold mb-4">Factura Detallada</h1>
                {/* Detalle principal (siempre primero, como antes) */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-4 mb-2">
                        <div><span className="font-semibold">Acta:</span> {payment.acta?.code}</div>
                        <div><span className="font-semibold">Cliente:</span> {payment.acta?.client?.name || '-'}</div>
                        <div><span className="font-semibold">Técnico:</span> {payment.acta?.creator?.name || '-'}</div>
                        <div><span className="font-semibold">Fecha de Pago:</span> {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : ''}</div>
                        <div><span className="font-semibold">Moneda:</span> {payment.currency}</div>
                        <div><span className="font-semibold">Monto:</span> ₡{payment.amount?.toLocaleString()}</div>
                        <div><span className="font-semibold">Total Cancelado:</span> {payment.is_total ? 'Sí' : 'No'}</div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <div><span className="font-semibold">Comprobante:</span> {payment.voucher_number}</div>
                        <div><span className="font-semibold">Referencia:</span> {payment.reference}</div>
                        <div><span className="font-semibold">Documento:</span> {payment.document_number}</div>
                        <div><span className="font-semibold">Transacción:</span> {payment.transaction_type}</div>
                        <div><span className="font-semibold">Receptor:</span> {payment.receiver}</div>
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Notas:</span> {payment.notes || '-'}
                    </div>
                </div>
                {/* Pagos ligados uno debajo de otro, excluyendo el principal si ya está */}
                <h2 className="text-lg font-bold mb-2">Pagos Ligados</h2>
                <div className="flex flex-col gap-6">
                    {linkedPayments
                        .filter(p => p.id !== payment.id)
                        .map((p, idx) => (
                        <div key={p.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex flex-wrap gap-4 mb-2">
                                <div><span className="font-semibold">Fecha:</span> {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''}</div>
                                <div><span className="font-semibold">Monto:</span> ₡{p.amount?.toLocaleString()}</div>
                                <div><span className="font-semibold">Comprobante:</span> {p.voucher_number}</div>
                                <div><span className="font-semibold">Referencia:</span> {p.reference}</div>
                            </div>
                            <div><span className="font-semibold">Notas:</span> {p.notes}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
