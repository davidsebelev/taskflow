from django.urls import path
from .views.fbv import login_view, logout_view
from .views.cbv import TaskListApiView, TaskApiDetailView


urlpatterns = [

    path('login/', login_view, name='login'),

    path('logout/', logout_view, name='logout'),

    path('tasks/', TaskListApiView.as_view(), name='task-list'),

    path('tasks/<int:task_id>/', TaskApiDetailView.as_view(), name='task-detail'),

]

