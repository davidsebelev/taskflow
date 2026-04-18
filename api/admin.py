from django.contrib import admin

from .models import Tag,Task,Comment,Category

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Task)
admin.site.register(Comment)

# Register your models here.
