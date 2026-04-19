from django.contrib.auth import authenticate

from rest_framework.decorators import api_view

from rest_framework.response import Response

from rest_framework import status

from ..serializers import LoginSerializer


@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data = request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username = username, password = password)

        if user is not None:
            return Response({"message" : "Login succesful"}, status = status.HTTP_200_OK)
        
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    return Response({"message": "Logout successful"},status=status.HTTP_200_OK)
