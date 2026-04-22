from rest_framework import serializers
from .models import Category, Tag, Comment, Task


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['author']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'text', 'author', 'author_username', 'task']
        read_only_fields = ['author', 'author_username', 'task']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['author']




#Сustom serializers


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only = True)


class TaskStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
    completed = serializers.BooleanField()
