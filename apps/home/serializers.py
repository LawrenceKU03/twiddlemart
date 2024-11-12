from rest_framework import serializers
from django.conf import settings

from .models import HomeInfo, AffliatePartner


class HomeInfoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)
    snippet = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = HomeInfo
        fields = [
            "catch_phrase",
            "desc",
            "image_url",
            "is_store_visible",
            "snippet"
        ]

    def get_image_url(self, obj):
        return settings.DOMAIN_URL+obj.image.url

    def get_snippet(self, obj):
        return obj.desc[:150]+"..."


class AffliatePartnerSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AffliatePartner
        fields = [
            "title",
            "logo_url",
            "desc"
        ]

    def get_logo_url(self, obj):
        return settings.DOMAIN_URL+obj.logo.url
