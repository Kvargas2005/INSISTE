<?php

namespace App\Http\Controllers;

use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class VerificationCodeController extends Controller
{
    /**
     * Mostrar o generar el código de verificación para el cliente autenticado.
     */
    public function show()
    {
        $user = auth()->user();

        $existingCode = VerificationCode::where('id_user', $user->id)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if ($existingCode) {
            $code = $existingCode->code;

            // Aseguramos que expires_at es un objeto Carbon antes de usar toDateTimeString()
            $expires_at = \Illuminate\Support\Carbon::parse($existingCode->expires_at);
        } else {
            $code = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
            $expires_at = now()->addMinutes(5);

            VerificationCode::create([
                'id_user' => $user->id,
                'code' => $code,
                'expires_at' => $expires_at,
            ]);
        }

        return Inertia::render('CodigoVerificacion', [
            'code' => $code,
            'expires_at' => $expires_at->toDateTimeString(),
        ]);
    }

}
