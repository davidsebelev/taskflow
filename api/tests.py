from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Comment, Task


User = get_user_model()


class TaskCommentsApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', password='pass12345')
        self.other_user = User.objects.create_user(username='other', password='pass12345')
        self.category = Category.objects.create(name='Work', description='', author=self.user)
        self.task = Task.objects.create(
            title='Prepare report',
            description='Quarterly summary',
            author=self.user,
            category=self.category,
        )
        self.comment = Comment.objects.create(
            text='First note',
            author=self.user,
            task=self.task,
        )
        self.client.force_authenticate(user=self.user)

    def test_list_task_comments(self):
        response = self.client.get(reverse('task-comments', args=[self.task.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], self.comment.text)
        self.assertEqual(response.data[0]['author_username'], self.user.username)

    def test_create_comment_for_owned_task(self):
        response = self.client.post(reverse('task-comments', args=[self.task.id]), {'text': 'Second note'})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.filter(task=self.task).count(), 2)
        self.assertEqual(response.data['author'], self.user.id)
        self.assertEqual(response.data['task'], self.task.id)

    def test_cannot_access_foreign_task_comments(self):
        foreign_category = Category.objects.create(name='Private', description='', author=self.other_user)
        foreign_task = Task.objects.create(
            title='Hidden task',
            description='Do not expose',
            author=self.other_user,
            category=foreign_category,
        )

        response = self.client.get(reverse('task-comments', args=[foreign_task.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
