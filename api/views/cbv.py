from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Task, Category, Comment
from ..serializers import TaskSerializer, CategorySerializer, CommentSerializer

from rest_framework.permissions import IsAuthenticated


class CategoryListApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.filter(author=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TaskListApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        tasks = Task.objects.filter(author=request.user)
        serializer = TaskSerializer(tasks, many = True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = TaskSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class TaskApiDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, task_id, user):
        return get_object_or_404(Task, pk = task_id, author=user)
    

    def get(self, request,task_id):
        task = self.get_object(task_id, request.user)
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    
    def put(self,request,task_id):
        task = self.get_object(task_id, request.user)
        serializer = TaskSerializer(task, data = request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    def delete(self,request,task_id):
        task = self.get_object(task_id, request.user)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskCommentsListCreateApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get_task(self, task_id, user):
        return get_object_or_404(Task, pk=task_id, author=user)

    def get(self, request, task_id):
        task = self.get_task(task_id, request.user)
        comments = Comment.objects.filter(task=task).select_related('author').order_by('id')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, task_id):
        task = self.get_task(task_id, request.user)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, task=task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
