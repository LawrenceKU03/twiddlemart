from django.contrib import admin
from .models import Related, Article, ArticlePart, Category, Tag, Heart, Pin, ArticleProduct

# Register your models here.
admin.site.register(Article)
admin.site.register(ArticlePart)
admin.site.register(Related)
admin.site.register(Tag)
admin.site.register(Category)
admin.site.register(Heart)
admin.site.register(Pin)
admin.site.register(ArticleProduct)
