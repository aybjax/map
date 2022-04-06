<?php

namespace App\Http\Controllers;

use App\Models\Field;
use Illuminate\Http\Request;
use App\Helpers\CultureStrategy;
use App\Models\Culture;
use Illuminate\Http\JsonResponse;
use App\Models\CultureField;
use App\Models\PlantedCultureField;
use App\Models\SuggestionCultureField;
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
        $fields = Field::without('culture')->select('id')->get();
        $year = intval(request()->header('X-YEAR', 2022));

        DB::transaction(function () use(&$fields, &$culture_ids, $culture_count, $year) {
            foreach($fields as $field) {
                $random = random_int(0, $culture_count - 1);
                PlantedCultureField::create([
                    'year' => $year,
                    'culture_id' => $culture_ids[$random]->id,
                    'field_id' => $field->id,
                ]);
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

        $year = intval(request()->header('X-YEAR', 2022));
        PlantedCultureField::where('year', $year)->delete();

        return response()->json([
            'success' => 'Все поля случайно заполнены'
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
        $fields = Field::all();

        return response()->json([
            'type' => "FeatureCollection",
            'name' => "tse-all",
            'crs' => [
                'type' => "name",
                'properties' => [
                    'name' => "urn:ogc:def:crs:OGC:1.3:CRS84"
                ],
            ],
            'features' => $fields,
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
        $year = intval(request()->header('X-YEAR', 2022));

        if($suggested_id === 0 || $field_id === 0) {
            return response()->json([
                'error' => 'Культура не выбрана',
            ]); 
        }

        $field = Field::find($field_id);

        // $current_culture_id = $field?->culture?->id ?? 0;
        $current_culture_id = $field?->properties?->planted_id;

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id,
            current_culture_id: $current_culture_id,
        );

        if(! $strategy->check()) {
            return response()->json([
                'error' => 'Данное действие не может быть одобрено',
            ]);
        }
        
        $prev_culture_id = $field?->lastProperties?->planted_id ?? 0;

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id,
            current_culture_id: $prev_culture_id,
        );

        if(! $strategy->check()) {
            return response()->json([
                'error' => 'Данное действие не может быть одобрено',
            ]);
        }

        if(auth()->user()->is_admin) {
            $planted = $field?->plantations->first(function(PlantedCultureField $plantedCulture) {
                return $plantedCulture->year === request()->header('X-YEAR', 0);
            });

            if($planted) {
                $planted->culture_id = $suggested_id;
                $planted->comment = $request->json('comment');
                $planted->year = $year;
                $field->save();

                return response()->json([
                    'success' => 'Изменения введены аыв аыв',
                ]);
            }
            
            PlantedCultureField::create([
                'culture_id' => $suggested_id,
                'comment' => $request->json('comment'),
                'year' => $year,
                'field_id' => $field_id,
            ]);

            return response()->json([
                'success' => 'Изменения введены аыв аыв',
            ]);
        }

        SuggestionCultureField::create([
            'culture_id' => $suggested_id,
            'field_id' => $field_id,
            'user_id' => $request->user()->id,
            'comment' => $request->json('comment'),
            'year' => $year,
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

        $suggested = SuggestionCultureField::where('year', intval(request()->header('X-YEAR', 2022)))
                        ->get();

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

        if(! $response?->year) {
            $response = $field->lastProperties;
        }
        return response()->json($response);
    }

    public function destroy(field $field): JsonResponse
    {
        PlantedCultureField::where('field_id', $field->id)
                ->where('year', intval(request()->header('X-YEAR'), 0))
                ->delete();

        return response()->json([
            'success' => 'Участок почитен'
        ]);
    }

    public function getSuggested(SuggestionCultureField $culture_field): JsonResponse
    {
        return response()->json($culture_field);
    }

    public function deleteSuggested(SuggestionCultureField $culture_field): JsonResponse
    {
        $culture_field->delete();

        return response()->json([
            'success' => 'Запрос удален',
        ]);
    }

    public function acceptSuggested(SuggestionCultureField $culture_field): JsonResponse
    {
        if(! auth()->user()->is_admin) {
            return response()->json([
                'error' => 'У Вас нет прав',
            ]);
        }

        $suggested_id = $culture_field->culture_id;
        $field = $culture_field->field;
        $current_culture_id = $field?->properties?->planted_id;

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id,
            current_culture_id: $current_culture_id,
        );

        if(! ($suggested_id && $field?->id)) {
            $culture_field->delete();

            return response()->json([
                'error' => 'Возможно культура или участок удален',
            ]); 
        }
        
        $prev_culture_id = $field?->lastProperties?->planted_id ?? 0;

        $strategy = new CultureStrategy(
            suggested_culture_id: $suggested_id,
            current_culture_id: $prev_culture_id,
        );

        if(! $strategy->check()) {
            return response()->json([
                'error' => 'Данное действие не может быть одобрено. Возможно данные изменились',
            ]);
        }

        if(! $field) {
            return response()->json([
                'error' => 'Участок удален. Действие остановлено',
            ]);
        }
            
        PlantedCultureField::create([
            'culture_id' => $suggested_id,
            'comment' => $culture_field->commment,
            'year' => $culture_field->year,
            'field_id' => $culture_field->field_id,
        ]);

        $culture_field->delete();

        return response()->json([
            'success' => 'Культура посажено',
        ]);
    }
}