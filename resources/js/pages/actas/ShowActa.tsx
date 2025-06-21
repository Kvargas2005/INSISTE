import React, { useRef, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@radix-ui/react-label';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface ActaProps {
    acta: {
        id: number;
        client: { id: number; name: string };
        creator: { id: number; name: string };
        components: any[];
        services: any[];
        deliverys: any[];
        jobs: any[];
        client_signature?: string;
        technician_signature?: string;
        start_time?: string;
        end_time?: string;
        contact?: string;
        phone?: string;              // <--- agregado aquí
        is_open?: boolean;
        service_location?: string;
        description?: string;
        code?: string;
        notes?: string;
        delivery_scope?: string;
        visit_type?: string;
        service_detail?: string;
        delivery_category_detail?: string;
        job_type_detail?: string[];
    };
    actaComponents: any[];
    actaServices: any[];
    actaDeliverys: any[];
    actaJobs: any[];
}

const ShowActa: React.FC<ActaProps> = ({
    acta,
    actaComponents,
    actaServices,
    actaDeliverys,
    actaJobs,
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    const sigPadRef = useRef<SignatureCanvas | null>(null);
    const [clientSignatureImage, setClientSignatureImage] = React.useState<string | null>(null);

    useEffect(() => {
        if (sigPadRef.current && acta.client_signature) {
            sigPadRef.current.clear();
            sigPadRef.current.fromData(JSON.parse(acta.client_signature));
            setTimeout(() => {
                if (sigPadRef.current) {
                    setClientSignatureImage(sigPadRef.current.getCanvas().toDataURL('image/png'));
                }
            }, 100);
        } else {
            setClientSignatureImage(null);
        }
    }, [acta.client_signature]);

    const sigPadRefTech = useRef<SignatureCanvas | null>(null);
    const [TechSignatureImage, setTechSignatureImage] = React.useState<string | null>(null);
    const logoBase64 = 'data:image/png;base64,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'; // Pega aquí toda la cadena base64


    useEffect(() => {
        if (sigPadRefTech.current && acta.technician_signature) {
            sigPadRefTech.current.clear();
            sigPadRefTech.current.fromData(JSON.parse(acta.technician_signature));
            setTimeout(() => {
                if (sigPadRefTech.current) {
                    setTechSignatureImage(sigPadRefTech.current.getCanvas().toDataURL('image/png'));
                }
            }, 100);
        } else {
            setTechSignatureImage(null);
        }
    }, [acta.technician_signature]);

    const { auth } = usePage<{ auth: { user: { id_role: number } } }>().props;

    const handleDownloadPdf = () => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginLeft = 40;
        const marginRight = pageWidth - marginLeft;
        const bottomMargin = 40;

        // Logo arriba izquierda (aprox. 150x80)
        pdf.addImage(logoBase64, 'PNG', marginLeft, 20, 150, 80);

        // Nombre empresa al lado del logo (bold, 14)
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('INTRA Seguridad Electrónica SE, S.A', marginLeft + 267, 40);

        // Info empresa debajo nombre (normal, 10)
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Cédula Jurídica: 3-101-721464', marginLeft + 267, 58);
        pdf.text('Mail: info@intrase.net', marginLeft + 267, 74);
        pdf.text('Web: www.intrase.net', marginLeft + 267, 90);

        // Datos en dos columnas debajo título (normal, 11)
        const leftColX = marginLeft;
        const rightColX = pageWidth / 2 + 10;
        let currentY = 120;
        const lineHeight = 18;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');

        // Izquierda
        pdf.text(`Cliente: ${acta.client?.name || ''}`, leftColX, currentY);
        pdf.text(`Teléfono: ${acta.phone || ''}`, leftColX, currentY + lineHeight);
        pdf.text(`Contacto: ${acta.contact || ''}`, leftColX, currentY + lineHeight * 2);
        pdf.text(`Lugar de servicio: ${acta.service_location || ''}`, leftColX, currentY + lineHeight * 3);
        pdf.text(`Modalidad Entrega: ${acta.delivery_scope || ''}`, leftColX, currentY + lineHeight * 4);
        pdf.text(`Tipo de Visita: ${acta.visit_type || ''}`, leftColX, currentY + lineHeight * 5);

        // Derecha
        pdf.text(`N°: ${acta.code || acta.id}`, rightColX, currentY);
        pdf.text(`Técnico: ${acta.creator?.name || ''}`, rightColX, currentY + lineHeight);

        // Mostrar fecha y hora solo si es admin, si no solo la fecha
        let fechaInicio = '';
        if (auth?.user?.id_role === 1) {
            // Mostrar fecha y hora
            fechaInicio = acta.start_time ? new Date(acta.start_time).toLocaleString('es-CR', { hour12: false }) : '';
        } else {
            // Solo la fecha
            fechaInicio = acta.start_time ? new Date(acta.start_time).toLocaleDateString('es-CR') : '';
        }
        pdf.text(`Fecha Inicio: ${fechaInicio}`, rightColX, currentY + lineHeight * 2);

        // Solo mostrar Fecha Fin si el usuario es admin (id_role === 1)
        if (auth?.user?.id_role === 1) {
            let fechaFin = acta.end_time ? new Date(acta.end_time).toLocaleString('es-CR', { hour12: false }) : '';
            pdf.text(`Fecha Fin: ${fechaFin}`, rightColX, currentY + lineHeight * 3);
        }

        const lineY = currentY + lineHeight * 6 + 10;
        pdf.setLineWidth(1);
        pdf.setDrawColor(0);
        pdf.line(marginLeft, lineY, marginRight, lineY);

        currentY = lineY + 20;

        // Secciones servicios, entregas y trabajos
        const sections = [
            {
                title: 'Tipo de Servicio',
                data: [
                    ...actaServices.filter(s => (s.service?.description || s.service_name) !== 'Otro'),
                    ...(acta.service_detail && acta.service_detail.trim() !== ''
                        ? [{ service: { description: acta.service_detail } }]
                        : []),
                ],
                getText: (s: any) => s.service?.description || s.service_name,
            },
            {
                title: 'Trabajos Realizado',
                data: [
                    ...actaJobs.filter(j => (j.job?.name || j.job_name) !== 'Otro'),
                    ...(Array.isArray(acta.job_type_detail)
                        ? acta.job_type_detail
                            .filter((j) => typeof j === 'string' && j.trim() !== '')
                            .map((j) => ({ job: { name: j } }))
                        : (typeof acta.job_type_detail === 'string' && acta.job_type_detail && String(acta.job_type_detail).trim() !== '')
                            ? [{ job: { name: String(acta.job_type_detail) } }]
                            : []),
                ],
                getText: (j: any) => j.job?.name || j.job_name,
            },
            {
                title: 'Tipo de Entrega',
                data: [
                    ...actaDeliverys.filter(d => (d.delivery?.name || d.delivery_name) !== 'Otros'),
                    ...(acta.delivery_category_detail && acta.delivery_category_detail.trim() !== ''
                        ? [{ delivery: { name: acta.delivery_category_detail } }]
                        : []),
                ],
                getText: (d: any) => d.delivery?.name || d.delivery_name,
            },

        ];

        sections.forEach(({ title, data, getText }) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(80, 85, 95);


            pdf.setFillColor(200, 200, 200);
            pdf.rect(marginLeft, currentY - 14, marginRight - marginLeft, 20, 'F');

            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(title, marginLeft + 10, currentY);
            currentY += 20;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);

            if (data.length > 0) {
                data.forEach(item => {
                    const text = getText(item);
                    const splitText = pdf.splitTextToSize(text, marginRight - marginLeft - 20);
                    pdf.text(splitText, marginLeft + 10, currentY);
                    currentY += splitText.length * 14;
                });
            } else {
                pdf.text(`No hay ${title.toLowerCase()}`, marginLeft + 10, currentY);
                currentY += 20;
            }
            currentY += 10;
        });

        // Descripción debajo de trabajos
        if (acta.description && acta.description.trim() !== '') {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(80, 85, 95);
            pdf.text('Descripción:', marginLeft, currentY);
            currentY += 20;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            const descSplit = pdf.splitTextToSize(acta.description, marginRight - marginLeft - 20);
            pdf.text(descSplit, marginLeft + 10, currentY);
            currentY += descSplit.length * 14 + 10;
        }

        // Tabla componentes con salto de página automático
        const printTableHeader = () => {
            pdf.setFillColor(80, 85, 95);
            pdf.setTextColor(255, 255, 255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.rect(marginLeft, currentY - 14, marginRight - marginLeft, 20, 'F');
            pdf.text('Artículos', marginLeft + 10, currentY);
            pdf.text('Cantidad', marginRight - 60, currentY, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            currentY += 30;
        };

        printTableHeader();

        if (actaComponents.length > 0) {
            actaComponents.forEach((comp) => {
                const desc = comp.component?.description || comp.component_name || '';
                const qty = String(comp.quantity || '');
                const splitDesc = pdf.splitTextToSize(desc, marginRight - marginLeft - 100);
                const itemHeight = splitDesc.length * 14 + 8;

                // Salto de página si se pasa del margen inferior
                if (currentY + itemHeight > pageHeight - bottomMargin) {
                    pdf.addPage();
                    currentY = marginLeft;
                    printTableHeader();
                }

                pdf.text(splitDesc, marginLeft + 10, currentY);
                pdf.text(qty, marginRight - 60, currentY, { align: 'right' });

                currentY += itemHeight;
                pdf.setLineWidth(0.5);
                pdf.line(marginLeft, currentY - 15, marginRight, currentY - 15);
            });
        } else {
            pdf.text('No hay artículos', marginLeft + 10, currentY);
            currentY += 30;
        }

        currentY += 20;

        // Notas
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Notas adicionales:', marginLeft, currentY);
        currentY += 20;

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const notesText = acta.notes || 'Sin notas';
        const notesSplit = pdf.splitTextToSize(notesText, marginRight - marginLeft - 20);

        // Salto de página para notas largas
        notesSplit.forEach((line: string) => {
            if (currentY > pageHeight - bottomMargin) {
                pdf.addPage();
                currentY = marginLeft;
            }
            pdf.text(line, marginLeft + 10, currentY);
            currentY += 14;
        });
        currentY += 20;

        // Firmas lado a lado
        const firmaWidth = 150;
        const firmaHeight = 60;
        if (TechSignatureImage) {
            if (currentY + firmaHeight + 15 > pageHeight - bottomMargin) {
                pdf.addPage();
                currentY = marginLeft;
            }
            pdf.addImage(TechSignatureImage, 'PNG', marginLeft, currentY, firmaWidth, firmaHeight);
            pdf.text('Firma Técnico', marginLeft + 20, currentY + firmaHeight + 15);
        }
        if (clientSignatureImage) {
            if (currentY + firmaHeight + 15 > pageHeight - bottomMargin) {
                pdf.addPage();
                currentY = marginLeft;
            }
            pdf.addImage(clientSignatureImage, 'PNG', marginRight - firmaWidth, currentY, firmaWidth, firmaHeight);
            pdf.text('Firma Cliente', marginRight - firmaWidth + 20, currentY + firmaHeight + 15);
        }

        // Pie página
        const footerText1 = 'Acta de Servicio / Inspección';
        const footerText2 = 'Comprobante Electrónico';
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(footerText1, pageWidth / 2, 820, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.text(footerText2, pageWidth / 2, 835, { align: 'center' });

        // Guardar PDF
        pdf.save(`Acta-${acta.code || acta.id}.pdf`);
    };


    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Actas', href: '/actas/list' },
                { title: `Detalle Acta #${acta.id}`, href: `/actas/show/${acta.id}` },
            ]}
        >
            <Head title={`Detalle Acta #${acta.id}`} />

            <div
                ref={printRef}
                className="m-4 p-6 rounded shadow bg-white"
                style={{ color: '#374151' }}
            >
                <h1 className="text-2xl font-bold mb-4">Acta {acta.code}</h1>
                <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Cliente</Label>
                        <div>{acta.client?.name}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Técnico</Label>
                        <div>{acta.creator?.name}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Fecha Inicio</Label>
                        <div>{acta.start_time}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Contacto</Label>
                        <div>{acta.contact}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Estado</Label>
                        <div>{acta.is_open ? 'Abierta' : 'Cerrada'}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Localidad</Label>
                        <div>{acta.service_location}</div>
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4">
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400">Descripción</Label>
                        <div>{acta.description}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                    <div>
                        <table className="w-full border-collapse text-sm text-gray-500 bg-gray-200 rounded-lg">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Servicio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actaServices.length > 0 ? (
                                    actaServices.map((service, key) => (
                                        <tr key={key} className="border-t">
                                            <td className="px-4 py-2">
                                                {service.service?.description || service.service_name}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2 text-center" colSpan={1}>
                                            No hay servicios
                                        </td>
                                    </tr>
                                )}
                                {acta.service_detail && (
                                    <tr>
                                        <td className="px-4 py-2">
                                            {acta.service_detail}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table className="w-full border-collapse text-sm text-gray-500 bg-gray-200 rounded-lg">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Entrega</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actaDeliverys.length > 0 ? (
                                    actaDeliverys
                                        .filter(delivery => delivery.delivery?.id !== 7)
                                        .map((delivery, key) => (
                                            <tr key={key} className="border-t">
                                                <td className="px-4 py-2">{delivery.delivery?.name}</td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2 text-center" colSpan={1}>
                                            No hay entregas
                                        </td>
                                    </tr>
                                )}
                                {acta.delivery_category_detail && (
                                    <tr>
                                        <td className="px-4 py-2">
                                            {acta.delivery_category_detail}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table className="w-full border-collapse text-sm text-gray-500 bg-gray-200 rounded-lg">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Trabajo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actaJobs.length > 0 ? (
                                    actaJobs
                                        .filter(job => job.job?.id !== 7)
                                        .map((job, key) => (
                                            <tr key={key} className="border-t">
                                                <td className="px-4 py-2">{job.job?.name}</td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2 text-center" colSpan={1}>
                                            No hay trabajos
                                        </td>
                                    </tr>
                                )}

                                {acta.job_type_detail && (
                                    <tr>
                                        <td className="px-4 py-2">
                                            {acta.job_type_detail}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <table className="w-full border-collapse text-sm text-gray-500 bg-gray-200 rounded-lg ">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Artículos</th>
                            <th className="px-4 py-2 text-center">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actaComponents.length > 0 ? (
                            actaComponents.map((comp, key) => (
                                <tr key={key} className="border-t">
                                    <td className="px-4 py-2">
                                        {comp.component?.description || comp.component_name}
                                    </td>
                                    <td className="text-center px-4 py-2">{comp.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-4 py-2 text-center" colSpan={2}>
                                    No hay artículos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mb-4 grid grid-cols-[200px_200px_200px_1fr] gap-4 pt-4">
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3 text-center">
                        <Label className="text-gray-400">Código</Label>
                        <div>{acta.code}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3 text-center">
                        <Label className="text-gray-400">Modalidad Entrega</Label>
                        <div>{acta.delivery_scope}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3 text-center">
                        <Label className="text-gray-400 ">Tipo de Visita</Label>
                        <div>{acta.visit_type}</div>
                    </div>
                    <div className="grid border rounded-xl w-full bg-gray-200 p-3">
                        <Label className="text-gray-400 ">Notas</Label>
                        <div>{acta.notes}</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2 items-center">
                        <Label className="bg-sky-950 text-white p-2 rounded-xl">Firma del Técnico</Label>
                        <div className="relative border w-full bg-gray-200 ">
                            {TechSignatureImage ? (
                                <img
                                    src={TechSignatureImage}
                                    alt="Firma del Técnico"
                                    className="w-full h-32 object-contain bg-white"
                                />
                            ) : (
                                <SignatureCanvas ref={sigPadRefTech} canvasProps={{ className: 'w-full h-32' }} />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <Label className="bg-sky-950 text-white p-2 rounded-xl">Firma del Cliente</Label>
                        <div className="relative border w-full bg-gray-200 ">
                            {clientSignatureImage ? (
                                <img
                                    src={clientSignatureImage}
                                    alt="Firma del Cliente"
                                    className="w-full h-32 object-contain bg-white"
                                />
                            ) : (
                                <SignatureCanvas ref={sigPadRef} canvasProps={{ className: 'w-full h-32' }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-4 text-center">
                <button
                    onClick={handleDownloadPdf}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Descargar PDF
                </button>
            </div>
        </AppLayout>
    );
};

export default ShowActa;
