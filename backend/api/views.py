from django.shortcuts import render
import os
import requests
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Create your views here.


@api_view(["POST"])
def create_student(request):
    """
    Create a new student user in Supabase using admin API
    """
    try:
        # Log the incoming request data
        print("🔥 Received request data:", request.data)

        # Extract data from request
        data = request.data
        email = data.get("email")
        password = data.get("password")
        user_metadata = data.get("user_metadata", {})

        # If password is not provided, use student_id as password
        if not password and "student_id" in user_metadata:
            password = user_metadata["student_id"]

        # Log the extracted data
        print("🔥 Extracted data:")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print(f"User Metadata: {user_metadata}")

        if not email:
            print("❌ Missing email")
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not password:
            print("❌ Missing password")
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare headers for Supabase Admin API
        headers = {
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        }

        # Prepare payload for user creation
        payload = {
            "email": email,
            "password": password,
            "email_confirm": True,  # Auto-confirm email
            "user_metadata": user_metadata,
        }

        print("🔥 Sending payload to Supabase:", payload)

        # Call Supabase Admin API to create user
        response = requests.post(
            f"{SUPABASE_URL}/auth/v1/admin/users", headers=headers, json=payload
        )

        response_data = response.json()
        print("🔥 Supabase response:", response_data)

        # Check if user was created successfully (status code 200 or 201)
        if response.status_code in [200, 201]:
            return Response(
                {"user_id": response_data["id"]}, status=status.HTTP_201_CREATED
            )
        else:
            # If user already exists or other error
            print(f"❌ Supabase error: {response.status_code} - {response_data}")
            return Response(
                {"error": "Failed to create user", "details": response_data},
                status=response.status_code,
            )

    except Exception as e:
        print(f"❌ Exception occurred: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
