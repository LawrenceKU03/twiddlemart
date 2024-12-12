from rest_framework import serializers
from .models import Related, ArticlePart, Article, Category, Heart, Pin
from apps.store.serializers import ProductSerializer
from django.conf import settings


class ArticlePartSerializer(serializers.ModelSerializer):
    cover_photo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ArticlePart
        fields = [
            "pk",
            "desc",
            "cover_photo_url",
            "image_dir"
        ]

    def get_cover_photo_url(self, obj):
        return settings.DOMAIN_URL+obj.cover_photo.url


class RelatedArticleSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField(read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    slug = serializers.SerializerMethodField(read_only=True)
    category_slug = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Related
        fields = [
            "title",
            "slug",
            "image_url",
            "category_slug"
        ]

    def get_title(self, obj):
        return obj.related_article.title

    def get_image_url(self, obj):
        return settings.DOMAIN_URL+obj.related_article.cover_photo.url

    def get_slug(self, obj):
        return obj.related_article.slug

    def get_category_slug(self, obj):
        return obj.related_article.category.slug


class ArticleSerializer(serializers.ModelSerializer):
    cover_photo_url = serializers.SerializerMethodField(read_only=True)
    snippet = serializers.SerializerMethodField(read_only=True)
    hearts = serializers.SerializerMethodField(read_only=True)
    pins = serializers.SerializerMethodField(read_only=True)
    parts = serializers.SerializerMethodField(read_only=True)
    related_articles = serializers.SerializerMethodField(read_only=True)
    products = serializers.SerializerMethodField(read_only=True)
    category_slug = serializers.SerializerMethodField(read_only=True)
    tag = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = [
            "pk",
            "category_slug",
            "title",
            "slug",
            "desc",
            "cover_photo_url",
            "snippet",
            "hearts",
            "pins",
            "rank_score",
            "parts",
            "related_articles",
            "products",
            "tag"
        ]

    def get_cover_photo_url(self, obj):
        return settings.DOMAIN_URL+obj.cover_photo.url

    def get_snippet(self, obj):
        return obj.desc[:100]+"..."

    def get_hearts(self, obj):
        hearts = len(Heart.objects.filter(article=obj))
        return hearts

    def get_pins(self, obj):
        pins = len(Pin.objects.filter(article=obj))
        return pins

    def get_parts(self, obj):
        return ArticlePartSerializer(obj.article_parts.all(), many=True).data

    def get_related_articles(self, obj):
        related_articles = obj.related_articles.all()[:5]
        return RelatedArticleSerializer(related_articles, many=True).data

    def get_products(self, obj):
        products = [mobj.product for mobj in obj.products.all()]
        return ProductSerializer(products, many=True).data

    def get_category_slug(self, obj):
        return obj.category.slug

    def get_tag(self, obj):
        return obj.tag.slug


class PageNumberHolder:
    page_num = 1

    def set_page_num(self, num):
        self.page_num = num


class CategoriesSerializer(serializers.ModelSerializer, PageNumberHolder):

    articles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "pk",
            "title",
            "slug",
            "articles"
        ]

    def get_articles(self, obj):
        query_size = len(obj.articles.all())
        total_pages = 1
        if ((query_size/settings.PAGE_SIZE) % 2) == 0:
            total_pages = int(query_size/settings.PAGE_SIZE)
            total_pages = 1 if total_pages == 0 else total_pages
        else:
            total_pages = int(query_size/settings.PAGE_SIZE)
            total_pages = 1 if total_pages == 0 else total_pages

        self.page_num = self.page_num if self.page_num <= total_pages else 1
        article_objs = obj.articles.all()[(
            (self.page_num-1)*settings.PAGE_SIZE):(self.page_num*settings.PAGE_SIZE)]
        articles = ArticleSerializer(article_objs, many=True).data
        return {"current_page": self.page_num, "total_pages": total_pages, "result": articles}
