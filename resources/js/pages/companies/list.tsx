import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import DropdownMenuList from '@/components/dropdownMenu';
import ModalFormCreate from '@/components/ModalFormCreate';
import ModalFormEdit from '@/components/ModalFormEdit';
import { ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';

interface Company {
  id: number;
  name: string;
  description?: string;
  rut?: string;
  main_address?: string;
  contact?: string;
  address?: string;
  company_email?: string;
  main_contact?: string;
  phone?: string;
  extension?: string;
  cellphone?: string;
  email?: string;
  status: number;
}

interface Props {
  companies: Company[];
}

export default function CompanyList({ companies }: Props) {
  const { flash } = usePage().props as unknown as { flash: { success?: string; error?: string } };
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);
  const [statusFilter, setStatusFilter] = useState<'none' | 'activeToInactive' | 'inactiveToActive'>('none');
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  const handleFilterStatus = () => {
    const sorted = [...filteredCompanies];
    switch (statusFilter) {
      case 'none':
        sorted.sort((a, b) => b.status - a.status);
        setStatusFilter('activeToInactive');
        break;
      case 'activeToInactive':
        sorted.sort((a, b) => a.status - b.status);
        setStatusFilter('inactiveToActive');
        break;
      case 'inactiveToActive':
        setFilteredCompanies(companies);
        setStatusFilter('none');
        return;
    }
    setFilteredCompanies(sorted);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    const filtered = companies.filter(c =>
      (c.name?.toLowerCase().includes(term)) ||
      (c.contact?.toLowerCase().includes(term)) ||
      (c.email?.toLowerCase().includes(term))
    );
    setFilteredCompanies(filtered);
  };

  useEffect(() => {
    if (flash.success) {
      Swal.fire({ icon: 'success', title: 'Éxito', text: flash.success, timer: 3000, showConfirmButton: false });
    }
    if (flash.error) {
      Swal.fire({ icon: 'error', title: 'Error', text: flash.error, timer: 3000, showConfirmButton: false });
    }
  }, [flash]);

  return (
    <>
      <AppLayout breadcrumbs={[{ title: 'Empresas', href: '/company' }]}>
        <Head title="Empresas" />
        <div className="flex flex-row gap-6 m-4 overflow-x-auto">
          <a href="/company" className="dark:text-white text-sky-600 text-[14px] hover:text-sky-600/75 cursor-pointer">
            Empresa
          </a>
          <a href="/users/listAdmin" className="dark:text-white  text-black text-[14px] hover:text-sky-600/75 cursor-pointer">
            Usuarios
          </a>
        </div>

        <div className="flex justify-between m-4">
          <div className="relative w-1/3">
            <Input
              type="text"
              placeholder="Buscar empresa"
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
            />
          </div>
          <button
            onClick={() => setShowModalCreate(true)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: 'black' }}
          >
            Crear
          </button>
        </div>

        <div className="m-4 shadow rounded-lg overflow-x-auto pb-[100px] max-h-[500px] min-h-[500px]">
          <table className="min-w-[1200px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Nombre</th>
                <th className="text-left px-4 py-2">Contacto</th>
                <th className="text-left px-4 py-2">RUT</th>
                <th className="text-left px-4 py-2">Dirección Principal</th>
                <th className="text-left px-4 py-2">Correo Empresa</th>
                <th className="text-left px-4 py-2">Teléfono</th>
                <th className="text-left px-4 py-2">Descripción</th>
                <th onClick={handleFilterStatus} className="text-center px-4 py-2 cursor-pointer">
                  <div className="flex items-center justify-center gap-1">Estado <ArrowUpDown /></div>
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-left">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-t">
                    <td className="px-4 py-2">{company.name}</td>
                    <td className="px-4 py-2">{company.contact || '-'}</td>
                    <td className="px-4 py-2">{company.rut || '-'}</td>
                    <td className="px-4 py-2">{company.main_address || '-'}</td>
                    <td className="px-4 py-2">{company.company_email || '-'}</td>
                    <td className="px-4 py-2">{company.phone || '-'}</td>
                    <td className="px-4 py-2">{company.description || '-'}</td>
                    <td className="px-4 py-2">
                      <span className="px-5 py-1 rounded-full" style={{
                        backgroundColor: company.status === 1 ? '#a7d697' : '#d69797',
                        color: company.status === 1 ? '#437b30' : '#873535',
                        border: `1px solid ${company.status === 1 ? '#437b30' : '#873535'}`
                      }}>
                        {company.status === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <DropdownMenuList
                        id={company.id}
                        status={company.status}
                        routeEdit=""
                        routeToggle="company.toggleStatus"
                        onOpenModal={() => {
                          setSelectedId(company.id);
                          setShowModalEdit(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-2">No se encontraron empresas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AppLayout>

      {showModalCreate && (
        <ModalFormCreate
          title="Registrar Empresa"
          postRoute="company.store"
          inputs={[
            { name: 'name', label: 'Nombre de la Empresa', type: 'text' },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'rut', label: 'RUT / NIT', type: 'text' },
            { name: 'main_address', label: 'Dirección Principal', type: 'text' },
            { name: 'contact', label: 'Contacto', type: 'text' },
            { name: 'address', label: 'Dirección Alterna', type: 'text' },
            { name: 'company_email', label: 'Correo Empresa', type: 'email' },
            { name: 'main_contact', label: 'Contacto Principal', type: 'text' },
            { name: 'phone', label: 'Teléfono', type: 'text' },
            { name: 'extension', label: 'Extensión', type: 'text' },
            { name: 'cellphone', label: 'Celular', type: 'text' },
            { name: 'email', label: 'Correo Electrónico Secundario', type: 'email' },
          ]}
          onClose={() => setShowModalCreate(false)}
        />
      )}
      {showModalEdit && (
        <ModalFormEdit
          id={selectedId}
          fetchRoute="company.fetchCompany"
          postRoute="company.edit"
          title="Editar Empresa"
          inputs={[
            { name: 'name', label: 'Nombre de la Empresa', type: 'text' },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'rut', label: 'RUT / NIT', type: 'text' },
            { name: 'main_address', label: 'Dirección Principal', type: 'text' },
            { name: 'contact', label: 'Contacto', type: 'text' },
            { name: 'address', label: 'Dirección Alterna', type: 'text' },
            { name: 'company_email', label: 'Correo Empresa', type: 'email' },
            { name: 'main_contact', label: 'Contacto Principal', type: 'text' },
            { name: 'phone', label: 'Teléfono', type: 'text' },
            { name: 'extension', label: 'Extensión', type: 'text' },
            { name: 'cellphone', label: 'Celular', type: 'text' },
            { name: 'email', label: 'Correo Electrónico Secundario', type: 'email' },
          ]}
          onClose={() => setShowModalEdit(false)}
        />
      )}
    </>
  );
}
