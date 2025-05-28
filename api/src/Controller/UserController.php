<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use OpenApi\Attributes as OA;

#[Route('/api/user', name: 'user')]
#[OA\Tag(name: 'Users')]
final class UserController extends AbstractController{
    #[Route('', name: 'user_register', methods: ['POST'])]
    #[OA\Post(summary: 'Register a new user')]
    #[OA\RequestBody(
        description: 'User registration data',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                new OA\Property(property: 'password', type: 'string', example: 'securepassword'),
                new OA\Property(property: 'role', type: 'string', example: 'TEACHER')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'User registered successfully',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'User registered successfully'),
                new OA\Property(property: 'id', type: 'integer', example: 1)
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input or validation error'
    )]
    #[OA\Response(
        response: 409,
        description: 'Email or username already in use'
    )]
    public function user_register(
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> registerUser($data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Delete a user')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'User ID',
        schema: new OA\Schema(type: 'string'),
        example: 1
    )]
    #[OA\Response(
        response: 200,
        description: 'User deleted successfully'
    )]
    #[OA\Response(
        response: 404,
        description: 'User not found'
    )]
    public function user_delete(
        string $id,
        UserService $userService
    ): JsonResponse
    {

        $result  = $userService -> deleteUser($id);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{id}', name: 'user_update', methods: ['PUT'])]
    #[OA\Put(summary: 'Update a user')]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'User ID',
        schema: new OA\Schema(type: 'integer'),
        example: 1
    )]
    #[OA\RequestBody(
        description: 'User data to update',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'John Smith'),
                new OA\Property(property: 'email', type: 'string', example: 'john.smith@example.com'),
                new OA\Property(property: 'password', type: 'string', example: 'newsecurepassword')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'User updated successfully'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    #[OA\Response(
        response: 404,
        description: 'User not found'
    )]
    #[OA\Response(
        response: 409,
        description: 'Email already in use'
    )]
    public function user_update(
        string $id,
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request -> getContent();
        $data = json_decode($body, true);

        $result  = $userService -> updateUser($id, $data);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('', name: 'user_list', methods: ['GET'])]
    #[OA\Get(summary: 'Get all users')]
    #[OA\Response(
        response: 200,
        description: 'Returns all users',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 'b39da7a7-01cc-4e2c-b561-41cff468d472'),
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                    new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                    new OA\Property(property: 'role', type: 'string', example: 'TEACHER'),
                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2025-05-08T10:15:00')
                ]
            )
        )
    )]
    public function users_list(
        UserService $userService
    ): JsonResponse
    {
        $result  = $userService -> listAllUsers();

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/{param}', name: 'user_list_param', methods: ['GET'])]
    #[OA\Get(summary: 'Get users by parameter')]
    #[OA\Parameter(
        name: 'param',
        in: 'path',
        description: 'Parameter type (role, email, etc.)',
        schema: new OA\Schema(type: 'string'),
        example: 'role'
    )]
    #[OA\Parameter(
        name: 'value',
        in: 'query',
        description: 'Parameter value',
        schema: new OA\Schema(type: 'string'),
        example: 'TEACHER'
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns users matching the parameter',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                    new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                    new OA\Property(property: 'role', type: 'string', example: 'TEACHER'),
                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2025-05-08T10:15:00')
                ]
            )
        )
    )]
    #[OA\Response(
        response: 404,
        description: 'No users found'
    )]
    public function users_param_list(
        string $param,
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $query_value = $request -> query -> get('value');

        $result  = $userService -> listUsersByParam($param, $query_value);

        return $this -> json($result['body'], $result['status']);
    }


    #[Route('/login', name: 'user_login', methods: ['POST'])]
    #[OA\Post(summary: 'Login a user')]
    #[OA\RequestBody(
        description: 'User login credentials',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                new OA\Property(property: 'password', type: 'string', example: 'securepassword')
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Login successful',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Login successful'),
                new OA\Property(property: 'user', type: 'object', properties: [
                    new OA\Property(property: 'id', type: 'string', example: 'b39da7a7-01cc-4e2c-b561-41cff468d472'),
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                    new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                    new OA\Property(property: 'role', type: 'string', example: 'TEACHER')
                ])
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Invalid credentials'
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid input'
    )]
    public function user_login(
        Request $request, 
        UserService $userService
    ): JsonResponse
    {
        $body = $request->getContent();
        $data = json_decode($body, true);

        $result = $userService->loginUser($data);

        return $this->json($result['body'], $result['status']);
    }
}
