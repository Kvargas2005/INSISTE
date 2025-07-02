import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import DropdownMenuList from '@/components/dropdownMenu';

interface Payment {
    id: number;
    id_acta: number;
    amount_paid: number;
    concept: string;
    notes: string;
    payment_date: string;
    acta: { code: string, creator?: { name?: string, nombre?: string }, created_at?: string };
}

interface ActaOption {
    id: number;
    code: string;
}

interface Props {
    payments: Payment[];
    actas: ActaOption[];
}

export default function PaymentList({ payments, actas }: Props) {
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>(payments);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    // Filtros para el select de acta
    const [filterDate, setFilterDate] = useState('');
    const [filterClient, setFilterClient] = useState('');
    const [filterTechnician, setFilterTechnician] = useState('');

    useEffect(() => {
        setFilteredPayments(payments);
    }, [payments]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = payments.filter((p) =>
            p.acta?.code?.toLowerCase().includes(term) ||
            (p.concept || '').toLowerCase().includes(term)
        );
        setFilteredPayments(filtered);
    };

    // Opciones filtradas para el select de acta
    const filteredActas = actas.filter(a => {
        const dateMatch = filterDate ? (a.created_at && new Date(a.created_at).toLocaleDateString().includes(filterDate)) : true;
        const clientMatch = filterClient ? ((a.client?.name || a.client?.nombre || '').toLowerCase().includes(filterClient.toLowerCase())) : true;
        const techMatch = filterTechnician ? ((a.creator?.name || a.creator?.nombre || '').toLowerCase().includes(filterTechnician.toLowerCase())) : true;
        return dateMatch && clientMatch && techMatch;
    });

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Pagos', href: '/payments' }]}>            
                <Head title="Pagos" />

                <div className="flex justify-between m-4">
                    <div className="relative w-1/3">
                        <Input
                            type="text"
                            placeholder="Buscar pago o acta"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>
                    <button
                        onClick={() => setShowModalCreate(true)}
                        className="px-4 py-2 rounded text-white bg-black"
                    >
                        Registrar Pago
                    </button>
                </div>

                <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[800px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Acta</th>
                                <th className="text-left px-4 py-2">Monto Pagado</th>
                                <th className="text-left px-4 py-2">Concepto</th>
                                <th className="text-left px-4 py-2">Notas</th>
                                <th className="text-left px-4 py-2">Fecha de Pago</th>
                                <th className="text-left px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="border-t">
                                    <td className="px-4 py-2">
                                        {payment.acta?.code}
                                        {payment.acta?.creator?.name || payment.acta?.creator?.nombre ? (
                                            <>
                                                {' '}|{' '}
                                                <span className="text-xs text-gray-500">
                                                    {payment.acta.creator.name || payment.acta.creator.nombre}
                                                </span>
                                            </>
                                        ) : null}
                                        {payment.acta?.created_at ? (
                                            <>
                                                {' '}|{' '}
                                                <span className="text-xs text-gray-400">
                                                    {new Date(payment.acta.created_at).toLocaleDateString()}
                                                </span>
                                            </>
                                        ) : null}
                                    </td>
                                    <td className="px-4 py-2">₡{payment.amount_paid.toLocaleString()}</td>
                                    <td className="px-4 py-2">{payment.concept}</td>
                                    <td className="px-4 py-2">{payment.notes}</td>
                                    <td className="px-4 py-2">{payment.payment_date}</td>
                                    <td className="px-4 py-2">
                                        <DropdownMenuList
                                            id={payment.id}
                                            status={1}
                                            routeEdit=""
                                            routeToggle=""
                                            onOpenModal={() => {
                                                setSelectedId(payment.id);
                                                setShowModalEdit(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AppLayout>

            {showModalCreate && (
                <ModalFormCreate
                    title="Registrar Pago"
                    postRoute="payments.create"
                    inputs={[
                        {
                            name: 'id_acta',
                            label: 'Acta',
                            type: 'select',
                            selectType: 'react',
                            options: filteredActas.map(a => ({
                                value: a.id,
                                label: `${a.code} | ${(a.creator?.name || a.creator?.nombre || 'Sin técnico')} | ${(a.client?.name || a.client?.nombre || 'Sin cliente')} | ${a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}`
                            })),
                            extra: (
                                <div className="flex flex-col md:flex-row gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Filtrar técnico"
                                        value={filterTechnician}
                                        onChange={e => setFilterTechnician(e.target.value)}
                                        className="border rounded px-3 py-2 flex-grow"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filtrar cliente"
                                        value={filterClient}
                                        onChange={e => setFilterClient(e.target.value)}
                                        className="border rounded px-3 py-2 flex-grow"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Filtrar fecha"
                                        value={filterDate}
                                        onChange={e => setFilterDate(e.target.value)}
                                        className="border rounded px-3 py-2 flex-grow"
                                    />
                                </div>
                            )
                        },
                        { name: 'amount_paid', label: 'Monto Pagado', type: 'number' },
                        { name: 'concept', label: 'Concepto', type: 'text' },
                        { name: 'notes', label: 'Notas', type: 'textarea' },
                        { name: 'payment_date', label: 'Fecha de Pago', type: 'date' },
                    ]}
                    onClose={() => setShowModalCreate(false)}
                />
            )}

            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="payments.fetch"
                    postRoute="payments.edit"
                    title="Editar Pago"
                    inputs={[
                        {
                            name: 'id_acta',
                            label: 'Acta',
                            type: 'select',
                            selectType: 'react',
                            options: actas.map(a => ({
                                value: a.id,
                                label: `${a.code} | ${(a.creator?.name || a.creator?.nombre || 'Sin técnico')} | ${(a.client?.name || a.client?.nombre || 'Sin cliente')} | ${a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}`
                            }))
                        },
                        { name: 'amount_paid', label: 'Monto Pagado', type: 'number' },
                        { name: 'concept', label: 'Concepto', type: 'text' },
                        { name: 'notes', label: 'Notas', type: 'textarea' },
                        { name: 'payment_date', label: 'Fecha de Pago', type: 'date' },
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
