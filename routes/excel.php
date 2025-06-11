<?php

// Removed unused imports
use Illuminate\Support\Facades\Route;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Writer\Exception as WriterException;
use App\Http\Controllers\ComponentImportController;
use Inertia\Inertia;



Route::middleware(['rol:admin', 'permiso:excel_products'])->group(callback: function () {

    Route::get('/download/plantilla-completa', function () {
        $templatePath = storage_path('app/templates/plantilla_productos.xlsx');

        if (!file_exists($templatePath)) {
            abort(404, 'No se encontró la plantilla base.');
        }

        // Cargar la plantilla
        $spreadsheet = IOFactory::load($templatePath);

        // === [ HOJA: PROVEEDORES ] ===
        $sheetProveedores = $spreadsheet->getSheetByName('Marca');
        if (!$sheetProveedores) {
            abort(500, 'La hoja "Marca" no existe.');
        }

        $brands = \App\Models\Brand::select('id', 'name')->get();
        $row = 2; // Empezar desde la fila 2 (dejando encabezado intacto)

        foreach ($brands as $b) {
            // Evitar sobrescribir fórmulas o validaciones complejas
            $cellA = $sheetProveedores->getCell("A{$row}");
            $cellB = $sheetProveedores->getCell("B{$row}");

            if (!$cellA->isFormula()) {
                $sheetProveedores->setCellValueExplicit("A{$row}", $b->id, DataType::TYPE_STRING);
            }

            if (!$cellB->isFormula()) {
                $sheetProveedores->setCellValueExplicit("B{$row}", $b->name, DataType::TYPE_STRING);
            }

            $row++;
        }

        // === [ HOJA: COMPONENTES ] ===
        $sheetTipos = $spreadsheet->getSheetByName('Familia');
        if (!$sheetTipos) {
            abort(500, 'La hoja "Familia" no existe.');
        }

        $family = \App\Models\Family::select('id', 'name')->get();
        $row = 2;

        foreach ($family as $f) {
            $cellA = $sheetTipos->getCell("A{$row}");
            $cellB = $sheetTipos->getCell("B{$row}");

            if (!$cellA->isFormula()) {
                $sheetTipos->setCellValueExplicit("A{$row}", $f->id, DataType::TYPE_STRING);
            }

            if (!$cellB->isFormula()) {
                $sheetTipos->setCellValueExplicit("B{$row}", $f->name, DataType::TYPE_STRING);
            }

            $row++;
        }

        // Crear carpeta temporal si no existe
        $tempFolder = storage_path('app/temp');
        if (!file_exists($tempFolder)) {
            mkdir($tempFolder, 0755, true);
        }

        $filename = 'plantilla_completa_' . now()->format('Ymd_His') . '.xlsx';
        $tempPath = "{$tempFolder}/{$filename}";

        try {
            $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
            $writer->setPreCalculateFormulas(false); // 🔒 No calcular fórmulas estructuradas
            $writer->save($tempPath);
        } catch (WriterException $e) {
            abort(500, 'Error al guardar el archivo Excel.');
        }

        return response()->download($tempPath)->deleteFileAfterSend(true);
    });

    
    Route::middleware(['permiso:confirm_products'])->group(function () {
        Route::get('/upload-excel/page', fn() => Inertia::render('components/uploadExcel'))->name('upload-excel.page');
        Route::post('/confirm-products', [ComponentImportController::class, 'confirm']);
        Route::post('/check-duplicates', [ComponentImportController::class, 'checkDuplicates']);
        Route::get('/brands/fetch', [ComponentImportController::class, 'fetchBrands']);
        Route::get('/family/fecth', [ComponentImportController::class, 'fetchFamily']);
    });

});