from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(default="", null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        self.title = self.title.capitalize()
        slug = self.title.lower()
        slug.replace(" ", "-")
        self.slug = slug
        super().save(*args, **kwargs)


class Product(models.Model):
    category = models.ForeignKey(
        Category, related_name="products", on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    desc = models.TextField()
    price = models.DecimalField(max_digits=255, decimal_places=2)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(
        upload_to="product_images/", null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    rank_score = models.FloatField(default=0)
    is_white_date_color = models.BooleanField(default=False)
    vendor = models.CharField(default="Amazon", max_length=255)
    vendor_affliate_link = models.CharField(max_length=255, default="")

    class Meta:
        ordering = ["-rank_score"]

    def __str__(self):
        return self.title


class Heart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="hearted_products", on_delete=models.CASCADE)

    def __str__(self):
        return self.product.title


class Pin(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="pinned_products", on_delete=models.CASCADE)

    def __str__(self):
        return self.product.title
