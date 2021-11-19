<?php

namespace App\Http\Controllers;

use App\Helpers\CultureStrategy;
use App\Models\Field;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Culture;

class CultureController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'preps' => Culture::all(),
        ]);
    }

    public function checkCulture(Request $request): JsonResponse
    {
        $suggested_id = $request->json('culture_id', 0);
        $field_id = $request->json('field_id', 0);

        if($suggested_id === 0 || $field_id === 0) {
            return response()->json([
                'error' => 'Культура не выбрана',
            ]); 
        }

        $field = Field::find($field_id);

        $current_culture_id = $field?->culture?->id ?? 0;

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id,
            current_culture_id: $current_culture_id,
        );

        if($strategy->check()) {
            return response()->json([
                'success' => 'Данное действие может быть одобрено',
            ]);
        }

        return response()->json([
            'error' => 'Данное действие не может быть одобрено',
        ]);
    }
}