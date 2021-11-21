<?php

namespace App\Http\Controllers;

use App\Models\Field;
use Illuminate\Http\Request;
use App\Helpers\CultureStrategy;
use App\Models\Culture;
use Illuminate\Http\JsonResponse;
use App\Models\CultureField;
use Illuminate\Support\Facades\DB;

class FieldController extends Controller
{
    public function seedFields(Request $request): JsonResponse
    {
        if(! $request->user()->is_admin) {
            return response()->json([
                'error' => 'У Вас нет прав'
            ]);
        }

        $culture_ids = Culture::select('id')->get();
        $culture_count = $culture_ids->count();
        $fields = Field::without('culture')->get();

        DB::transaction(function () use(&$fields, &$culture_ids, $culture_count) {
            foreach($fields as $field) {
                if(! $field->culture_id) {
                    $random = random_int(0, $culture_count - 1);
                    $field->culture_id = $culture_ids[$random]->id;
                    $field->save();
                }
            }
        });

        return response()->json([
            'success' => 'Все поля случайно заполнены'
        ]);
    }

    public function resetFields(Request $request): JsonResponse
    {
        if(! $request->user()->is_admin) {
            return response()->json([
                'error' => 'У Вас нет прав'
            ]);
        }

        DB::table('fields')->update([
            'culture_id' => null,
            'comment' => null,
        ]);

        return response()->json([
            'success' => 'Все поля почищены',
        ]);
    }

    /**
     *  Display a listing of the resource.
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'type' => "FeatureCollection",
            'name' => "tse-all",
            'crs' => [
                'type' => "name",
                'properties' => [
                    'name' => "urn:ogc:def:crs:OGC:1.3:CRS84"
                ],
            ],
            'features' => Field::all(),
        ]);
    }
    
    /**
     * Summary of suggestCulture
     * @param Request $request
     * @return JsonResponse
     */
    public function suggestCulture(Request $request): JsonResponse
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

        if(! $strategy->check()) {
            return response()->json([
                'error' => 'Данное действие не может быть одобрено',
            ]);
        }

        if(auth()->user()->is_admin) {
            $field->culture_id = $suggested_id;
            $field->comment = $request->json('comment');
            $field->save();

            return response()->json([
                'success' => 'Изменения введены',
            ]);
        }

        CultureField::create([
            'culture_id' => $suggested_id,
            'field_id' => $field_id,
            'user_id' => $request->user()->id,
            'comment' => $request->json('comment'),
        ]);

        return response()->json([
            'success' => 'Запрос отправлен администратору',
        ]);
    }

    public function allSuggested(Request $request): JsonResponse
    {
        if(! $request->user()->is_admin) {
            return response()->json([]);
        }

        $suggested = CultureField::all();

        return response()->json($suggested);
    }

    /**
     * Display the specified resource.
     * @param Field $field
     * @return JsonResponse
     */
    public function show(Field $field): JsonResponse
    {
        $response = $field->properties;
        return response()->json($response);
    }

    public function destroy(field $field): JsonResponse
    {
        $field->culture_id = null;
        $field->comment = null;
        $field->save();

        return response()->json([
            'success' => 'Участок почитен'
        ]);
    }

    public function getSuggested(CultureField $culture_field): JsonResponse
    {
        return response()->json($culture_field);
    }

    public function deleteSuggested(CultureField $culture_field): JsonResponse
    {
        $culture_field->delete();

        return response()->json([
            'success' => 'Запрос удален',
        ]);
    }

    public function acceptSuggested(CultureField $culture_field): JsonResponse
    {
        if(! auth()->user()->is_admin) {
            return response()->json([
                'error' => 'У Вас нет прав',
            ]);
        }

        $suggested_id = $culture_field->culture_id;
        $field_id = $culture_field->field_id;

        if(! ($suggested_id && $field_id)) {
            return response()->json([
                'error' => 'Возможно культура или участок удален',
            ]); 
        }

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id ?? 0,
            current_culture_id: $culture_field->field?->culture_id ?? 0,
        );

        if(! $strategy->check()) {
            return response()->json([
                'error' => 'Данное действие не может быть одобрено. Возможно данные изменились',
            ]);
        }

        $field = Field::find($culture_field->field_id);

        if(! $field) {
            return response()->json([
                'error' => 'Участок удален. Действие остановлено',
            ]);
        }

        $field->culture_id = $culture_field->culture_id;
        $field->comment = $culture_field->comment;
        $field->save();

        $culture_field->delete();

        return response()->json([
            'success' => 'Культура посажено',
        ]);
    }
}