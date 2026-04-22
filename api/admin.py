from django.contrib import admin

from .models import Tag, Task, Comment, Category


class OwnedModelAdmin(admin.ModelAdmin):
    exclude = ('author',)

    def save_model(self, request, obj, form, change):
        if not change or obj.author_id is None:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(Category)
class CategoryAdmin(OwnedModelAdmin):
    list_display = ('id', 'name', 'author')


@admin.register(Task)
class TaskAdmin(OwnedModelAdmin):
    list_display = ('id', 'title', 'category', 'completed', 'author')


@admin.register(Comment)
class CommentAdmin(OwnedModelAdmin):
    list_display = ('id', 'task', 'author')


admin.site.register(Tag)
