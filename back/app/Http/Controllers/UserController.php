<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator =  Validator::make($request->json()->all(), [
            'username' => 'required',
            'password' => 'required|same:password2',
            'password2' => 'required|same:password',
        ], [
            'username.required' => 'Заполните имя пользователя',
            'password.required' => 'Заполните пароль',
            'password2.required' => 'Повторите пароль',
            'password.same' => 'Пароли должны совпадать',
            'password2.same' => 'Пароли должны совпадать',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'username' => $request->json('username'),
            'password' => Hash::make($request->json('password')),
        ]);

        return response()->json([
            'message' => 'ok',
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->json()->all();

        $validator =  Validator::make($credentials, [
            'username' => 'required',
            'password' => 'required',
        ], [
            'username.required' => 'Заполните имя пользователя',
            'password.required' => 'Заполните пароль',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if(Auth::attempt($credentials)) {
            $token = $request->user()->createToken($request->json('username'));
            return response()->json([
                'token' => $token->plainTextToken,
                'is_admin' => $request->user()->is_admin ? true : false,
                'username' => $request->user()->username,
            ]);

        }

        return response()->json([
            'token' => '',
            'error' => 'Проверьте имя и пароль',
        ], 400);
    }
}