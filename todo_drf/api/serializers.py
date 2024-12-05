from typing import Dict, Any
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User
import re


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    # def validate_paaword(self,value):
    #     if len(value)<4:
    #         raise serializers.ValidationError("Password must be at least 4 characters long.")
    #     if not re.search(r'[^a-zA-Z0-9]', value):  # This will ensure at least one special character
    #         raise serializers.ValidationError("Password must contain at least one special character (other than digits).")

    def create(self, validated_data):
        # Create a new user instance with the validated data
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],

        )
        # Set the password (will automatically hash it)
        user.set_password(validated_data['password'])
        user.save()
        return user


# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     token_class = RefreshToken

#     def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
#         data = super().validate(attrs)

#         refresh = self.get_token(self.user)

#         # Add refresh and access tokens
#         data["refresh"] = str(refresh)
#         data["access"] = str(refresh.access_token)

#         # Add user_id and username
#         user_id = refresh.access_token.payload["user_id"]
#         user = User.objects.get(id=user_id)
#         data["user_id"] = self.user.id
#         data["email"] = self.user.email
#         data['username'] = self.user.username

#         # Update last login if setting is enabled
#         if api_settings.UPDATE_LAST_LOGIN:
#             update_last_login(None, self.user)

#         return data

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     token_class = RefreshToken

#     def validate(self, attrs):
#         data = super().validate(attrs)

#         # Create refresh and access tokens
#         refresh = self.get_token(self.user)

#         # Add refresh and access tokens to the data
#         data['refresh'] = str(refresh)
#         data['access'] = str(refresh.access_token)

#         # Add user details (username, user_id, email) to the data
#         data['username'] = self.user.username
#         data['user_id'] = self.user.id
#         data['email'] = self.user.email

#         print(f"data is here {data}")
#         # Return the updated data
#         return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    token_class = RefreshToken

    # Override the default error message
    default_error_messages = {
        'no_active_account': 'Invalid credentials. Please try again.'
    }

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        try:
            data = super().validate(attrs)

            refresh = self.get_token(self.user)

            # Add refresh and access tokens
            data["refresh"] = str(refresh)
            data["access"] = str(refresh.access_token)

            # Add user_id, email, and username
            user_id = refresh.access_token.payload["user_id"]
            user = User.objects.get(id=user_id)
            data["user_id"] = user.id
            data["email"] = user.email
            data['username'] = user.username

            print(f"data is here{data}")

            # Update last login if setting is enabled
            if api_settings.UPDATE_LAST_LOGIN:
                update_last_login(None, self.user)

            return data
        except Exception as e:
            # Allow custom error message to propagate
            raise e


