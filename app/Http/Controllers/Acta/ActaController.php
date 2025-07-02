<?php

namespace App\Http\Controllers\Acta;

use App\Models\Acta;
use App\Models\AssingInvTech;
use App\Models\ActaDetailComponent;
use App\Models\ActaService;
use App\Models\ActaDelivery;
use App\Models\ActaJobType;
use App\Models\User;
use App\Models\Service;
use App\Models\JobType;
use App\Models\AssignCustomerTech;
use App\Models\DeliveryClass;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ActaController extends Controller
{
    /**
     * Display a listing of the actas.
     */
    public function index()
    {
        $user = Auth::user();
        \Log::info('Acta index visitado por usuario', [
            'id' => $user->id,
            'rol' => $user->id_role
        ]);

        $query = Acta::with(['client', 'creator'])->orderByDesc('created_at');

        if ($user->id_role === 3) {
            // Técnico: solo actas que él ha creado
            $query->where('id_created_by', $user->id);
        } elseif ($user->id_role === 2) {
            // Cliente: solo actas que le pertenecen
            $query->where('id_for', $user->id);
        }

        $actas = $query->with(['services.service', 'deliverys.delivery', 'jobs.job'])->get();

        // Procesar actas para agregar campos string y arrays para filtros
        $servicesOptions = [];
        $deliveryClassOptions = [];
        $jobTypeOptions = [];
        $deliveryScopeOptions = [];

        $actas = $actas->map(function ($a) use (&$servicesOptions, &$deliveryClassOptions, &$jobTypeOptions, &$deliveryScopeOptions) {
            // Servicios
            $serviceNames = $a->services->map(fn($s) => $s->service->description ?? '')->filter()->all();
            foreach ($serviceNames as $name) {
                if ($name && !in_array($name, $servicesOptions)) $servicesOptions[] = $name;
            }
            // Entregas
            $deliveryNames = $a->deliverys->map(fn($d) => $d->delivery->name ?? '')->filter()->all();
            foreach ($deliveryNames as $name) {
                if ($name && !in_array($name, $deliveryClassOptions)) $deliveryClassOptions[] = $name;
            }
            // Trabajos
            $jobNames = $a->jobs->map(fn($j) => $j->job->name ?? '')->filter()->all();
            foreach ($jobNames as $name) {
                if ($name && !in_array($name, $jobTypeOptions)) $jobTypeOptions[] = $name;
            }
            // Alcance de entrega
            $scope = $a->delivery_scope ?? '';
            if ($scope && !in_array($scope, $deliveryScopeOptions)) $deliveryScopeOptions[] = $scope;

            // Pagada técnico
            $hasPayment = $a->payments && $a->payments->count() > 0;

            return [
                ...$a->toArray(),
                'service_type' => implode(', ', $serviceNames),
                'delivery_class' => implode(', ', $deliveryNames),
                'job_type' => implode(', ', $jobNames),
                'delivery_scope' => $scope,
                'has_payment' => $hasPayment,
            ];
        });

        return Inertia::render('actas/ListActas', [
            'actas' => $actas,
            'canCreate' => $user->hasPermission('create_acta'),
            'servicesOptions' => $servicesOptions,
            'deliveryClassOptions' => $deliveryClassOptions,
            'jobTypeOptions' => $jobTypeOptions,
            'deliveryScopeOptions' => $deliveryScopeOptions,
        ]);
    }


    /**
     * Show the form for creating a new acta.
     */
    public function create()
    {
        $user = Auth::user();

        // ❌ Bloquear acceso si es cliente
        if ($user->id_role === 2) {
            abort(403, 'No autorizado para crear actas.');
        }

        // Clientes (solo id_role == 2)
        $users = User::where('id_role', 2)
            ->select('id', 'name', 'contact', 'adress', 'phone', 'code')
            ->get();

        // Servicios activos
        $services = Service::where('status', 1)
            ->get()
            ->map(fn($s) => [
                'value' => $s->id,
                'label' => $s->description,
            ])
            ->toArray();

        // Agregar opción "Otros" con id 0
        $services[] = [
            'value' => 0,
            'label' => 'Otros',
        ];

        $jobs = JobType::get()->map(fn($s) => [
            'value' => $s->id,
            'label' => $s->name,
        ]);

        $delivery = DeliveryClass::get()->map(fn($s) => [
            'value' => $s->id,
            'label' => $s->name,
        ]);

        // Si es técnico, cargar su inventario; si es admin, ofrezco seleccionar técnico
        $techStock = [];
        $technicians = [];
        if ($user->id_role === 3) {
            $techStock = AssingInvTech::where('id_technician', $user->id)
                ->with('component:id,description')
                ->with('warehouse:id,name')
                ->get()
                ->map(fn($item) => [
                    'id_component' => $item->id_component,
                    'component_name' => $item->component->description,
                    'warehouse_name' => $item->warehouse->name,
                    'quantity' => $item->quantity,
                ]);
                if ($techStock->isEmpty()) {
                    abort(403, 'No tienes inventario asignado. Por favor, contacta a un administrador.');
                }
        } elseif ($user->id_role === 1) {
            $technicians = User::where('id_role', 3)
                ->select('id', 'name')
                ->get();
        }

        

        return Inertia::render('actas/CreateActaPage', [
            'id_tech' => $user->id,
            'users' => $users,
            'services' => $services,
            'techStock' => $techStock,
            'technicians' => $technicians,
            'jobs' => $jobs,
            'deliverys' => $delivery
        ]);
    }


    /**
     * Show the form for creating a new acta.
     */
    public function createWhitAssigment($id)
    {
        $user = Auth::user();

        // ❌ Bloquear acceso si es cliente
        if ($user->id_role === 2) {
            abort(403, 'No autorizado para crear actas.');
        }

        $assignment = AssignCustomerTech::with('services')->findOrFail($id);
        \Log::info('Creando acta para asignación', [
            'id' => $assignment
        ]);
        if ($assignment->id_technician == $user->id) {
            if ($assignment->getAttribute('id_technician') !== $user->id) {
                abort(403, 'No autorizado para crear actas para esta asignación.');
            }
            \Log::info('Creando acta para asignación', [
                'id' => $assignment->getAttribute('id'),
                'technician_id' => $assignment->getAttribute('id_technician'),
                'customer_id' => $assignment->getAttribute('id_customer'),
            ]);

            // Solo el cliente asignado
            $users = User::where('id', $assignment->getAttribute('id_customer'))
                ->select('id', 'name', 'contact', 'adress', 'phone', 'code')
                ->get();
            // Servicios activos
            $services = Service::where('status', 1)
                ->get()
                ->map(fn($s) => [
                    'value' => $s->id,
                    'label' => $s->description,
                ])
                ->toArray();

            // Agregar opción "Otros" con id 0
            $services[] = [
                'value' => 0,
                'label' => 'Otros',
            ];

            $jobs = JobType::get()->map(fn($s) => [
                'value' => $s->id,
                'label' => $s->name,
            ]);

            $delivery = DeliveryClass::get()->map(fn($s) => [
                'value' => $s->id,
                'label' => $s->name,
            ]);

            // Si es técnico, cargar su inventario; si es admin, ofrezco seleccionar técnico
            $techStock = [];
            $technicians = [];
            if ($user->id_role === 3) {
                $techStock = AssingInvTech::where('id_technician', $user->id)
                    ->with('component:id,description')
                    ->with('warehouse:id,name')
                    ->get()
                    ->map(fn($item) => [
                        'id_component' => $item->id_component,
                        'component_name' => $item->component->description,
                        'warehouse_name' => $item->warehouse->name,
                        'quantity' => $item->quantity,
                    ]);
            } elseif ($user->id_role === 1) {
                $technicians = User::where('id_role', 3)
                    ->select('id', 'name')
                    ->get();
            }
            $technician = User::where('id', $user->id)
                ->get();

            $assignment_services = $assignment->services->pluck('id')->toArray();

            \Log::info('Datos del técnico', [
                'id' => $technician[0]->tech_signature
            ]);

            return Inertia::render('actas/CreateActaPageAssig', [
                'id_tech' => $user->id,
                'tech_signature' => $technician[0]->tech_signature,
                'users' => $users,
                'assigment_id' => $id,
                'services' => $services,
                'techStock' => $techStock,
                'technicians' => $technicians,
                'jobs' => $jobs,
                'deliverys' => $delivery,
                'assignment_services' => $assignment_services
            ]);
        }
        else {
            abort(403, 'No autorizado para crear actas para esta asignación.');
        }
    }


    /**
     * Store a newly created acta in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $isAdmin = $user->id_role === 1;

        // Reglas de validación
        $rules = [
            'id_for' => 'required|exists:users,id',
            'delivery_scope' => 'required|string',
            'delivery_class' => 'required|array',
            'delivery_class.*' => 'exists:delivery_classes,id',
            'job_type' => 'required|array',
            'job_type.*' => 'exists:job_types,id',
            'visit_type' => 'required|string',
            'components' => 'array',
            'components.*.id_component' => 'required|exists:components,id',
            'components.*.quantity' => 'required|integer|min:1',
            'services' => 'nullable|array',
            'id_assignment' => 'nullable|exists:assign_customer_tech,id',
            'notes' => 'nullable|string',
            'is_open' => 'boolean',
        ];
        if ($isAdmin) {
            $rules['technician_id'] = 'required|exists:users,id';
        }

        $validated = $request->validate($rules);

        DB::beginTransaction();
        try {

            // Determinar el técnico responsable
            if ($isAdmin) {
                $techId = $validated['technician_id'];
            } else {
                $techId = $user->id;
            }

            // Validar que el técnico existe y es técnico
            $technician = User::where('id', $techId)->where('id_role', 3)->first();
            if (!$technician) {
                throw new \Exception("Técnico no válido.");
            }

            // Validar que el cliente existe y es cliente
            $client = User::where('id', $validated['id_for'])->where('id_role', 2)->first();
            if (!$client) {
                throw new \Exception("Cliente no válido.");
            }

            $client->update([
                'contact' => $request->input('contact'),
            ]);

            $client->save();

            $lastActa = Acta::orderByDesc('id')->first();
            $nextId = $lastActa ? $lastActa->id + 1 : 1;
            $uniqueCode = $technician->code . $nextId;

            // Solo validar asignación si se proporciona id_assignment
            if ($request->filled('id_assignment')) {
                $assignment = AssignCustomerTech::findOrFail($request->input('id_assignment'));
                if ($assignment['id_technician'] !== $techId) {
                    throw new \Exception("El técnico no está asignado a esta tarea.");
                }
            } else {
                $assignment = [];
            }

            // Crear acta (id_created_by = técnico responsable)
            $acta = Acta::create([
                'id_created_by' => $techId,
                'id_for' => $validated['id_for'],
                'contact' => $request->input('contact'),
                'project' => $request->input('project'),
                'service_location' => $request->input('service_location'),
                'phone' => $request->input('phone'),
                'code' => $uniqueCode,
                'delivery_scope' => $request->input('delivery_scope'),
                'delivery_category_detail' => $request->input('delivery_class_detail'),
                'job_type_detail' => $request->input('job_type_detail'),
                'service_detail' => $request->input('service_detail'),
                'description' => $request->input('description'),
                'visit_type' => $request->input('visit_type'),
                'start_time' => $assignment['start_date'] ?? now(),
                'end_time' => now(),
                'technician_signature' => $request->input('technician_signature'),
                'client_signature' => $request->input('client_signature'),
                'notes' => $request->input('notes'),
                'is_open' => $request->boolean('is_open'),
            ]);

            // Solo actualizar assignment si existe
            if (!empty($assignment) && is_object($assignment)) {
                $assignment->end_date = now();
                $assignment->tech_status = 3;
                $assignment->save();
            }

            // Detalle de componentes (usar inventario del técnico responsable)
            if (!empty($validated['components'])) {


                foreach ($validated['components'] as $comp) {
                    $stock = AssingInvTech::where('id_technician', $techId)
                        ->where('id_component', $comp['id_component'])
                        ->first();

                    if (!$stock || $stock->quantity < $comp['quantity']) {
                        throw new \Exception("Stock insuficiente para componente {$comp['id_component']}");
                    }

                    ActaDetailComponent::create([
                        'id_acta' => $acta->id,
                        'id_component' => $comp['id_component'],
                        'quantity' => $comp['quantity'],
                        'notes' => $comp['notes'] ?? null,
                    ]);

                    // Lógica de stock similar a la proporcionada

                    \App\Models\WarehouseStock::where('id_warehouse', $stock->id_warehouse_origin)
                        ->where('id_component', $comp['id_component'])
                        ->decrement('asigned_stock', $comp['quantity']);

                    // Eliminar fila si stock y asigned_stock son cero
                    \App\Models\WarehouseStock::where('stock', 0)
                        ->where('asigned_stock', 0)
                        ->where('id_warehouse', $stock->id_warehouse_origin)
                        ->where('id_component', $comp['id_component'])
                        ->delete();

                    \App\Models\InvHistory::create([
                        'id_user' => $techId,
                        'mov' => 'Uso en Acta de ' . $client['name'],
                        'date' => now(),
                        'quantity' => '-' . $comp['quantity'],
                        'id_component' => $comp['id_component'],
                        'id_warehouse' => $stock->id_warehouse_origin,
                    ]);

                    // Actualizar o eliminar el stock del técnico
                    $stock->decrement('quantity', $comp['quantity']);
                    if ($stock->quantity <= 0) {
                        $stock->delete();
                    }
                }
            }
            // Detalle de servicios
            if (!empty($validated['services'])) {
                foreach ($validated['services'] as $serviceId) {
                    if ($serviceId == 0) {
                        continue; // Omitir si es 0
                    }
                    $service = Service::find($serviceId);
                    if ($service) {
                        ActaService::create([
                            'id_acta' => $acta->id,
                            'id_service' => $serviceId,
                        ]);
                    }
                }
            }

            // Detalle de delivery_class
            if (!empty($validated['delivery_class'])) {
                foreach ($validated['delivery_class'] as $deliveryId) {
                    $delivery = DeliveryClass::find($deliveryId);
                    if ($delivery) {
                        ActaDelivery::create([
                            'id_acta' => $acta->id,
                            'id_delivery' => $deliveryId,
                        ]);
                    }
                }
            }

            \Log::info('delivery_class:', $validated['delivery_class']);

            // Detalle de job_type
            if (!empty($validated['job_type'])) {
                foreach ($validated['job_type'] as $jobId) {
                    // Buscar el ID por nombre
                    $jobType = JobType::find($jobId);
                    if ($jobType) {
                        ActaJobType::create([
                            'id_acta' => $acta->id,
                            'id_job_types' => $jobId,
                        ]);
                    }
                }
            }


            DB::commit();
            return redirect()->route('actas.index')->with('success', 'Acta creada con éxito.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified acta.
     */
    public function show($id)
    {
        $user = Auth::user();

        $acta = Acta::with([
            'client',
            'creator',
            'components',
            'services',
            'deliverys',
            'jobs',
        ])->findOrFail($id);

        // Verificación de permisos
        if (
            $user->id_role === 3 && $acta->id_created_by !== $user->id || // técnico ajeno
            $user->id_role === 2 && $acta->id_for !== $user->id           // cliente ajeno
        ) {
            abort(403, 'No autorizado a ver esta acta.');
        }

        $actaComponents = ActaDetailComponent::with('component')
            ->where('id_acta', $acta->id)
            ->get();
        $actaServices = ActaService::with('service')
            ->where('id_acta', $acta->id)
            ->get();
        $actaDeliverys = ActaDelivery::with('delivery')
            ->where('id_acta', $acta->id)
            ->get();
        $actaJobs = ActaJobType::with('job')
            ->where('id_acta', $acta->id)
            ->get();



        return Inertia::render('actas/ShowActa', [
            'acta' => $acta,
            'actaComponents' => $actaComponents,
            'actaServices' => $actaServices,
            'actaDeliverys' => $actaDeliverys,
            'actaJobs' => $actaJobs,
        ]);
    }

    /**
     * Show the form for editing the specified acta.
     */
    public function edit($id)
    {
        $acta = Acta::with([
            'components',
            'services',
            'jobTypes',
            'deliveryClasses',
            'client',
            'technician'
        ])->findOrFail($id);

        $actaData = [
            ...$acta->toArray(),
            'components' => $acta->components->map(function ($c) {
                $component = \App\Models\Component::find($c->id_component);
                return [
                    'id_component' => $c->id_component,
                    'description' => $component->description,
                    'quantity' => $c->quantity,
                    'warehouse_name' => $c->warehouse_name,
                    'id_warehouse' => $c->id_warehouse,
                ];
            }),
            'services' => $acta->services->pluck('id_service')->toArray(),
            'job_type' => $acta->jobTypes->pluck('id')->toArray(),
            'delivery_class' => $acta->deliveryClasses->pluck('id')->toArray(),
            'id_for' => $acta->client->id ?? null,
            'technician_id' => $acta->technician->id ?? null,
        ];

        \Log::info('Acta editada', [
            'id' => Service::select('id as value', 'description as label')->get()
        ]);

        return Inertia::render('actas/EditActa', [
            'acta' => $actaData,
            'users' => User::where('id_role', 2)->select('id', 'name')->get(),
            'services' => Service::select('id as value', 'description as label')->get(),
            'technicians' => User::where('id_role', 3)->select('id', 'name')->get(),
            'deliverys' => DeliveryClass::select('id as value', 'name as label')->get(),
            'jobs' => JobType::select('id as value', 'name as label')->get(),
        ]);
    }

    /**
     * Update the specified acta in storage.
     */
    public function update(Request $request, $id)
    {
        $acta = Acta::findOrFail($id);
        $validated = $request->validate([
            'technician_id' => 'required|exists:users,id',
            'id_for' => 'required|exists:users,id',
            'contact' => 'required|string',
            'project' => 'required|string',
            'service_location' => 'required|string',
            'phone' => 'required|string',
            'description' => 'required|string',
            'visit_type' => 'required|string',
            'job_type' => 'array',
            'delivery_class' => 'array',
            'services' => 'array',
            'components' => 'array',
            'notes' => 'nullable|string',
            'is_open' => 'boolean',
            'technician_signature' => 'required|string',
            'client_signature' => 'required|string',
        ]);
        $acta->fill($validated);
        $acta->save();

        \Log::info('Acta actualizada', [
            'id' => $validated['components'],
        ]);

        // Actualizar componentes (HasMany)
        if (isset($validated['components'])) {
            // Eliminar los existentes y crear los nuevos
            $acta->components()->delete();
            foreach ($validated['components'] as $component) {
                if (isset($component['id_component']) && isset($component['quantity']) && $component['quantity'] > 0) {
                    $acta->components()->create([
                        'id_component' => $component['id_component'],
                        'quantity' => $component['quantity'],
                        'notes' => $component['notes'] ?? null,
                    ]);
                }
            }

            // Actualizar jobTypes (HasMany)
            if (isset($validated['job_type'])) {
                // Eliminar los existentes y crear los nuevos
                $acta->jobs()->delete();
                foreach ($validated['job_type'] as $jobTypeId) {
                    if ($jobTypeId == 0) {
                        continue; // Omitir si es 0
                    }
                    $jobType = JobType::find($jobTypeId);
                    $acta->jobs()->create(['id_job_types' => $jobTypeId, 'name' => $jobType->name]);
                }
            }

            // Actualizar deliveryClasses (HasMany)
            if (isset($validated['delivery_class'])) {
                $acta->deliverys()->delete();
                foreach ($validated['delivery_class'] as $deliveryClassId) {
                    if ($deliveryClassId == 0) {
                        continue; // Omitir si es 0
                    }
                    $deliveryClass = DeliveryClass::find($deliveryClassId);
                    $acta->deliverys()->create(['id_delivery' => $deliveryClassId, 'name' => $deliveryClass->name]);
                }
            }

            // Actualizar services (HasMany)
            if (isset($validated['services'])) {
                $acta->services()->delete();
                foreach ($validated['services'] as $serviceId) {

                    if ($serviceId == 0) {
                        continue; // Omitir si es 0
                    }
                    $service = Service::find($serviceId);
                    $acta->services()->create(['id_service' => $serviceId, 'name' => $service->description]);
                }
            }
            // Componentes: lógica personalizada según tu modelo
            // ...
            return redirect()->route('actas.index')->with('success', 'Acta actualizada correctamente');
        }
    }

    /**
     * Cierra un acta (is_open = 0)
     */
    public function close($id)
    {
        $acta = Acta::findOrFail($id);
        $acta->is_open = 0;
        $acta->save();
        return back()->with('success', 'El acta ha sido cerrada.');
    }

    /**
     * Abre un acta (is_open = 1)
     */
    public function open($id)
    {
        $acta = Acta::findOrFail($id);
        $acta->is_open = 1;
        $acta->save();
        return back()->with('success', 'El acta ha sido abierta.');
    }
}
