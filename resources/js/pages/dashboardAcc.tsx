import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReceiptText, Receipt, Banknote, MoveRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contabilidad',
        href: '/dashboardAcc',
    },
];

export default function DashboardAcc() {
    const { auth } = usePage<SharedData>().props;

    const canAccess = (allowedRoles: number | number[]) => {
        const currentRole = Number(auth.user.id_role);
        return Array.isArray(allowedRoles)
            ? allowedRoles.includes(currentRole)
            : currentRole === allowedRoles;
    };

    const Card = ({ title, description, icon: Icon, color, gradient, href }: any) => (
        <a
            className="group relative aspect-video overflow-hidden rounded-xl bg-white dark:bg-zinc-800"
            style={{ boxShadow: `-1px 21px 30px -14px ${color}` }}
            href={href || '#'}
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: gradient }}
            />
            <div className="relative z-10 flex h-full w-full flex-col justify-between p-8">
                <div className="flex items-center justify-between">
                    <span className="textIconDashboard text-gray-900 dark:text-white group-hover:text-white text-xl font-medium transition-colors duration-300">
                        {title}
                    </span>
                </div>
                <div className="text-center text-sm font-medium text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                    {description}
                </div>
                <MoveRight className="text-gray-900 group-hover:text-white dark:text-white transition-colors duration-300" />
            </div>
            <span
                className="absolute top-0 right-0 z-10 flex h-16 w-16 items-center justify-center transition-colors duration-300"
                style={{ color }}
            >
                <Icon />
            </span>
        </a>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contabilidad" />
            <h2 className="p-4"><strong>Contabilidad</strong></h2>

            <div className="flex h-full flex-1 flex-col gap-10 rounded-xl p-4">
                <div className="grid auto-rows-min gap-10 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                    {canAccess([1, 2, 3]) && (
                        <>
                            <Card
                                title="Cotización"
                                description="Generar cotización"
                                icon={ReceiptText}
                                color="#FE815F"
                                gradient="linear-gradient(to top, #AB4022 0%, #C26248 71%, #FE815F 100%)"
                                href="/quotation"
                            />
                            <Card
                                title="Facturación"
                                description="Facturas pendientes"
                                icon={Receipt}
                                color="#3E7680"
                                gradient="linear-gradient(to top, #3E7680 0%, #5DACBA 71%, #7DDEEF 100%)"
                                href="/billing"
                            />
                            <Card
                                title="Pagos"
                                description="Gastos extraordinarios de los técnicos y servicios"
                                icon={Banknote}
                                color="#428FC7"
                                gradient="linear-gradient(to top, #428FC7 0%, #71A3C7 71%, #AAC2D3 100%)"
                                href="/payments"
                            />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
