from django.urls import path
from .views.fbv import login_view, logout_view
from .views.cbv import CategoryListApiView, TaskListApiView, TaskApiDetailView, TaskCommentsListCreateApiView
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [

    path('login/', login_view, name='login'),

    path('logout/', logout_view, name='logout'),

    path('categories/', CategoryListApiView.as_view(), name='category-list'),

    path('tasks/', TaskListApiView.as_view(), name='task-list'),

    path('tasks/<int:task_id>/', TaskApiDetailView.as_view(), name='task-detail'),

    path('tasks/<int:task_id>/comments/', TaskCommentsListCreateApiView.as_view(), name='task-comments'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

]
