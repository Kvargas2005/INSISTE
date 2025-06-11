import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@headlessui/react';
import { ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Product {
    id_brand: number;
    id_family: number;
    name: string;
    description: string;
    purchase_price: number;
    sale_price: number;
    part_n: string;
    duplicated: boolean;
}

export default function ComponentUploadList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
    const [families, setFamilies] = useState<{ id: number; name: string }[]>([]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);

        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            if (typeof bstr !== 'string') return;
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

            const formattedData = jsonData
            .slice(1)
            .filter((row) => 
                row.some((cell, index) => 
                    index !== 1 && cell !== null && cell !== undefined && String(cell).trim() !== ''
                )
            )
            .map((row) => ({
                id_brand: row[7],
                id_family: row[8],
                name: row[1] ?? '', // puede quedar como string vacío si es null o undefined
                description: row[2],
                purchase_price: row[5],
                sale_price: row[6],
                part_n: row[0],
                duplicated: false,
            }));
        

            const partNumbers = formattedData.map((product) => product.part_n);

            const response = await axios.post('/check-duplicates', {
                part_numbers: partNumbers,
            });

            const existingPartNumbers = response.data.existing_part_numbers;

            const updatedProducts = formattedData.map((product) => ({
                ...product,
                duplicated: existingPartNumbers.includes(product.part_n),
            }));

            setProducts(updatedProducts);
        };
        reader.readAsBinaryString(selectedFile);
    };

    const handleConfirm = async () => {

        console.log('Confirmar productos', products);
        try {
            const newProducts = products.filter((p) => !p.duplicated);
            if (newProducts.length === 0) {
                Swal.fire('Atención', 'No hay productos nuevos para agregar', 'warning');
                return;
            }

            await axios.post('/confirm-products', { products: newProducts });
            Swal.fire({
                title: 'Éxito',
                text: 'Productos agregados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/components';
            });
            setProducts([]);
            setFile(null);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al agregar productos', 'error');
        }
    };

    const filteredProducts = products.filter((product) =>
        Object.values(product).some((value) =>
            value !== null && value !== undefined && String(value).trim() !== ''
        )
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsRes, familiesRes] = await Promise.all([
                    axios.get('/brands/fetch'),
                    axios.get('/family/fecth    '),
                ]);
                setBrands(brandsRes.data);
                setFamilies(familiesRes.data);
                console.log('BRANDS:', brandsRes.data);
                console.log(products)
            } catch (err) {
                console.error('Error al cargar marcas o familias', err);
            }
        };

        fetchData();
    }, []);



    return (
        <AppLayout breadcrumbs={[{ title: 'Cargar Artículos', href: '/components-upload' }]}>
            <Head title="Cargar Artículos" />

            <div className="flex justify-between m-4">
                <div className="relative w-1/3">
                    <Input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white pl-10"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: 'black' }}
                        disabled={products.length === 0}
                    >
                        Confirmar nuevos
                    </button>
                    <a
                        href="/download/plantilla-completa"
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: 'black' }}
                    >
                        Descargar Plantilla
                    </a>
                </div>
            </div>


            <div className="m-4 shadow rounded-lg overflow-y-auto pb-[100px] overflow-x-auto max-h-[500px] min-h-[500px]">
                <table className="min-w-[600px] w-full border-collapse text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="text-center px-4 py-2">Marca</th>
                            <th className="text-center px-4 py-2">Familia</th>
                            <th className="text-center px-4 py-2">Nombre</th>
                            <th className="text-center px-4 py-2">Descripción</th>
                            <th className="text-center px-4 py-2">Precio Compra</th>
                            <th className="text-center px-4 py-2">Precio Venta</th>
                            <th className="text-center px-4 py-2">N° Parte</th>
                            <th className="text-center px-4 py-2">Ya existe</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, idx) => (
                                <tr key={idx} className={`border-t ${product.duplicated ? 'bg-red-100' : ''}`}>
                                    <td className="px-4 py-2">
                                        {brands.find(b => b.id === Number(product.id_brand))?.name || 'Desconocido'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {families.find(f => f.id === Number(product.id_family))?.name || 'Desconocido'}
                                    </td>

                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.description}</td>
                                    <td className="px-4 py-2">{product.purchase_price}</td>
                                    <td className="px-4 py-2">{product.sale_price}</td>
                                    <td className="px-4 py-2">{product.part_n}</td>
                                    <td className="px-4 py-2">{product.duplicated ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-4 py-2 text-center">
                                    No hay productos cargados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
