import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import DropdownMenuList from '@/components/dropdownMenu';

interface CustomerPayment {
    id: number;
    id_acta: number;
    voucher_number?: string;
    reference?: string;
    document_number?: string;
    transaction_type?: string;
    receiver?: string;
    payment_date: string;
    currency: string;
    amount: number;
    notes?: string;
    is_total: boolean;
    linked_payment_id?: number;
    acta?: { id: number; code: string; client?: { id: number; name?: string }; creator?: { name?: string }; created_at?: string };
}

interface ActaOption {
    id: number;
    code: string;
    client?: { id: number; name?: string };
    creator?: { name?: string };
    created_at?: string;
}

interface Props {
    payments: CustomerPayment[];
    actas: ActaOption[];
}

export default function CustomerPaymentList({ payments, actas }: Props) {
    const [filteredPayments, setFilteredPayments] = useState<CustomerPayment[]>(payments);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [modalData, setModalData] = useState<any>({});
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    // Cuando se selecciona un acta, actualizar el nombre del cliente automáticamente
    useEffect(() => {
        if (showModalCreate && modalData.id_acta) {
            const acta = actas.find(a => a.id === modalData.id_acta);
            setModalData((prev: any) => ({
                ...prev,
                cliente_id: acta && acta.client && typeof acta.client.id === 'number' ? acta.client.id : '',
                cliente_nombre: acta && acta.client && acta.client.name ? acta.client.name : ''
            }));
        } else if (showModalCreate && !modalData.id_acta) {
            setModalData((prev: any) => ({ ...prev, cliente_id: '', cliente_nombre: '' }));
        }
    }, [showModalCreate, modalData.id_acta, actas]);
    const [filterDate, setFilterDate] = useState('');
    const [filterClient, setFilterClient] = useState('');
    const [filterTechnician, setFilterTechnician] = useState('');

    useEffect(() => {
        setFilteredPayments(payments);
    }, [payments]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const filtered = payments.filter((p) =>
            (p.acta?.code || '').toLowerCase().includes(term) ||
            (p.reference || '').toLowerCase().includes(term) ||
            (p.voucher_number || '').toLowerCase().includes(term)
        );
        setFilteredPayments(filtered);
    };

    const filteredActas = actas.filter(a => {
        const dateMatch = filterDate ? (a.created_at && new Date(a.created_at).toLocaleDateString().includes(filterDate)) : true;
        const clientMatch = filterClient ? ((a.client?.name || '').toLowerCase().includes(filterClient.toLowerCase())) : true;
        const techMatch = filterTechnician ? ((a.creator?.name || '').toLowerCase().includes(filterTechnician.toLowerCase())) : true;
        return dateMatch && clientMatch && techMatch;
    });

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Pagos de Cliente', href: '/customerPayments' }]}>            
                <Head title="Pagos de Cliente" />
                <div className="flex justify-between m-4">
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar pago, acta o referencia"
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                        />
                    </div>
                    <button
                        onClick={() => setShowModalCreate(true)}
                        className="px-4 py-2 rounded text-white bg-black"
                    >
                        Registrar Pago Cliente
                    </button>
                </div>
                <div className="m-4 shadow rounded-lg overflow-x-auto max-h-[500px] min-h-[500px]">
                    <table className="min-w-[900px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-2">Acta</th>
                                <th className="text-left px-4 py-2">Cliente</th>
                                <th className="text-left px-4 py-2">Comprobante</th>
                                <th className="text-left px-4 py-2">Referencia</th>
                                <th className="text-left px-4 py-2">Documento</th>
                                <th className="text-left px-4 py-2">Transacción</th>
                                <th className="text-left px-4 py-2">Receptor</th>
                                <th className="text-left px-4 py-2">Fecha Pago</th>
                                <th className="text-left px-4 py-2">Moneda</th>
                                <th className="text-left px-4 py-2">Monto</th>
                                <th className="text-left px-4 py-2">Total Cancelado</th>
                                <th className="text-left px-4 py-2">Notas</th>
                                <th className="text-left px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="border-t">
                                    {/* ...existing code... */}
                                    <td className="px-4 py-2">{payment.acta?.code}</td>
                                    <td className="px-4 py-2">{payment.acta?.client?.name || '-'}</td>
                                    <td className="px-4 py-2">{payment.voucher_number}</td>
                                    <td className="px-4 py-2">{payment.reference}</td>
                                    <td className="px-4 py-2">{payment.document_number}</td>
                                    <td className="px-4 py-2">{payment.transaction_type}</td>
                                    <td className="px-4 py-2">{payment.receiver}</td>
                                    <td className="px-4 py-2">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : ''}</td>
                                    <td className="px-4 py-2">{payment.currency}</td>
                                    <td className="px-4 py-2">₡{payment.amount?.toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={payment.id ? `/customerPayments/show/${payment.id}` : '#'}
                                            className={
                                                payment.is_total
                                                    ? 'text-green-600 font-bold underline'
                                                    : 'text-red-600 font-bold underline'
                                            }
                                        >
                                            {payment.is_total ? 'Sí' : 'No'}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{payment.notes}</td>
                                    <td className="px-4 py-2">
                                        <DropdownMenuList
                                            id={payment.id}
                                            status={payment.is_total ? 1 : 0}
                                            routeEdit=""
                                            routeToggle="customerPayments.toggle"
                                            onOpenModal={() => {
                                                setSelectedId(payment.id);
                                                setShowModalEdit(true);
                                            }}
                                        />
                                    </td>
                                    {/* ...existing code... */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AppLayout>
            {showModalCreate && (
                <ModalFormCreate
                    title="Registrar Pago Cliente"
                    postRoute="customerPayments.store"
                    inputs={[
                        {
                            name: 'id_acta',
                            label: 'Acta',
                            type: 'select',
                            selectType: 'react',
                            options: filteredActas.map(a => ({
                                value: a.id,
                                label: `${a.code} | ${(a.creator?.name || 'Sin técnico')} | ${(a.client?.name || 'Sin cliente')} | ${a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}`,
                                cliente_id: a.client && typeof a.client.id === 'number' ? a.client.id : undefined
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
                        { name: 'voucher_number', label: 'Número Comprobante', type: 'text' },
                        { name: 'reference', label: 'Referencia', type: 'text' },
                        { name: 'document_number', label: 'Número Documento', type: 'text' },
                        { name: 'transaction_type', label: 'Transacción', type: 'text' },
                        { name: 'receiver', label: 'Receptor', type: 'text' },
                        { name: 'payment_date', label: 'Fecha de Pago', type: 'date' },
                        { name: 'currency', label: 'Moneda', type: 'text' },
                        { name: 'amount', label: 'Monto', type: 'number' },
                        { name: 'notes', label: 'Notas', type: 'textarea' },
                        { name: 'is_total', label: 'Total Cancelado', type: 'checkbox' },
                        {
                            name: 'linked_payment_id',
                            label: 'Factura Padre',
                            type: 'select',
                            selectType: 'react',
                            options: payments.map(p => ({
                                value: p.id,
                                label: `Pago #${p.id} | ${p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''} | ₡${p.amount?.toLocaleString()}`
                            }))
                        }
                    ]}
                    onClose={() => setShowModalCreate(false)}
                    extraData={modalData}
                    setExtraData={setModalData}
                    onFieldChange={(field: string, value: any) => {
                        if (field === 'id_acta') {
                            const acta = actas.find(a => a.id === value);
                            setModalData((prev: any) => ({
                                ...prev,
                                id_acta: value,
                                cliente_id: acta && acta.client && typeof acta.client.id === 'number' ? acta.client.id : '',
                                cliente_nombre: acta && acta.client && acta.client.name ? acta.client.name : ''
                            }));
                        } else {
                            setModalData((prev: any) => ({ ...prev, [field]: value }));
                        }
                    }}
                    renderInput={(input: any, value: any, onChange: any) => {
                        if (input.name === 'cliente_id') {
                            return (
                                <input
                                    type="text"
                                    name="cliente_nombre"
                                    value={modalData.cliente_nombre ?? ''}
                                    readOnly
                                    className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-500"
                                    placeholder="Cliente"
                                />
                            );
                        }
                        return undefined;
                    }}
                />
            )}

            {showModalEdit && (
                <ModalFormEdit
                    id={selectedId}
                    fetchRoute="customerPayments.fetch"
                    postRoute="customerPayments.edit"
                    title="Editar Pago Cliente"
                    inputs={[
                        {
                            name: 'id_acta',
                            label: 'Acta',
                            type: 'select',
                            selectType: 'react',
                            options: actas.map(a => ({
                                value: a.id,
                                label: `${a.code} | ${(a.creator?.name || 'Sin técnico')} | ${(a.client?.name || 'Sin cliente')} | ${a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}`
                            }))
                        },
                        { name: 'cliente_id', label: 'Cliente', type: 'text' },
                        { name: 'voucher_number', label: 'Número Comprobante', type: 'text' },
                        { name: 'reference', label: 'Referencia', type: 'text' },
                        { name: 'document_number', label: 'Número Documento', type: 'text' },
                        { name: 'transaction_type', label: 'Transacción', type: 'text' },
                        { name: 'receiver', label: 'Receptor', type: 'text' },
                        { name: 'payment_date', label: 'Fecha de Pago', type: 'date' },
                        { name: 'currency', label: 'Moneda', type: 'text' },
                        { name: 'amount', label: 'Monto', type: 'number' },
                        { name: 'notes', label: 'Notas', type: 'textarea' },
                        { name: 'is_total', label: 'Total Cancelado', type: 'checkbox' },
                        { name: 'linked_payment_id', label: 'Factura Padre', type: 'number' }
                    ]}
                    onClose={() => setShowModalEdit(false)}
                />
            )}
        </>
    );
}
