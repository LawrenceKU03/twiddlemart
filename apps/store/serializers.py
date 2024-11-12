from rest_framework import serializers
from .models import Product, Category, Heart, Pin
from django.conf import settings


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    snippet = serializers.SerializerMethodField(read_only=True)
    created = serializers.SerializerMethodField(read_only=True)
    hearts = serializers.SerializerMethodField(read_only=True)
    pins = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "pk",
            "category",
            "title",
            "desc",
            "price",
            "image",
            "snippet",
            "created",
            "is_white_date_color",
            "hearts",
            "pins",
            "rank_score",
            "vendor",
            "vendor_affliate_link"
        ]

    def get_main_image(self, obj):
        return settings.DOMAIN_URL+obj.image.url

    def get_snippet(self, obj):
        return obj.desc[:100]+"..."

    def get_created(self, obj):
        return str(obj.created)[:10].replace("-", "/")

    def get_image(self, obj):
        return settings.DOMAIN_URL+obj.image.url if obj.image else obj.image_url

    def get_hearts(self, obj):
        return len(Heart.objects.filter(product=obj))+8000

    def get_pins(self, obj):
        return len(Pin.objects.filter(product=obj))+2500

    def get_category(self, obj):
        return obj.category.slug


class PageNumberMixin:
    page_num = 1

    def set_page_num(self, num):
        self.page_num = num


class CategorySerizializer(serializers.ModelSerializer, PageNumberMixin):
    products = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "title",
            "slug",
            "products"
        ]

    def get_products(self, obj):
        query_size = len(obj.products.all())

        total_pages = 1
        if ((query_size/settings.PAGE_SIZE) % 2) == 0:
            total_pages = int(query_size/settings.PAGE_SIZE)
            total_pages = 1 if total_pages == 0 else total_pages
        else:
            total_pages = int(query_size/settings.PAGE_SIZE)
            total_pages = 1 if total_pages == 0 else total_pages
            if query_size > settings.PAGE_SIZE:
                total_pages += 1

        products = obj.products.all()[(
            (self.page_num-1)*settings.PAGE_SIZE):(self.page_num*settings.PAGE_SIZE)]

        return {
            "current_page": self.page_num,
            "total_pages": total_pages,
            "result": ProductSerializer(products, many=True).data
        }
