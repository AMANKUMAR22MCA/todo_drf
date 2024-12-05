from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from api.serializers import CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes

from .models import Task
# Create your views here.
import re


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/',
    }

    return Response(api_urls)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_details(request, user_id):
    try:
        # Fetch the user by ID
        user = User.objects.get(id=user_id)
        # Return relevant user details
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def taskList(request):
    print(request.method)
    tasks = Task.objects.filter(user=request.user).order_by('-id')
    serializer = TaskSerializer(tasks, many=True)
    print(request.user)
    print(request.auth)
    print(request.user.email)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk, user=request.user)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def taskCreate(request):
    print(request.method)
    data = {
        **request.data,
        "user": request.user.id
    }
    serializer = TaskSerializer(data=data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def taskUpdate(request, pk):
    try:
        task = Task.objects.get(id=pk, user=request.user)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    # Pass 'partial=True' to allow partial updates
    serializer = TaskSerializer(instance=task, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        # Return validation errors if the data is not valid
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk, user=request.user)
    task.delete()

    return Response('Item succsesfully delete!')


User = get_user_model()  # Get the user model


def validate_password(password):
    # Check if the password is at least 4 characters long
    if len(password) < 4:
        return "Password must be at least 4 characters long."

    # Check if the password contains at least one special character and no digits only
    if not re.search(r'[^a-zA-Z0-9]', password):
        return "Password must contain at least one special character other than digits."

    return None


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        # Check if the email already exists
        if User.objects.filter(email=email).exists() and User.objects.filter(username=username).exists():
            return Response({'error': 'username and email both are already registered'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'username is already registered'}, status=status.HTTP_400_BAD_REQUEST)

        password_error = validate_password(password)
        if password_error:
            return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the user if data is valid
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)

        error_messages = {}

        # For each field error in the serializer, add it to the error response
        for field, errors in serializer.errors.items():
            # Joining multiple errors into a single string (in case there are multiple errors for a field)
            error_messages[field] = ", ".join(errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# from rest_framework_simplejwt.views import TokenObtainPairView

# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer
