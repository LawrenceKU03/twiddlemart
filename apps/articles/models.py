from django.db import models
from django.contrib.auth.models import User

from .interlinkHandler import TextMatch
from apps.store.models import Product
from django.conf import settings

# Create your models here.


class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        self.title = self.title.capitalize()
        super().save(*args, **kwargs)


class Tag(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="tags")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.title = self.title.capitalize()
        super().save(*args, **kwargs)


class Article(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE,
                            related_name="tag_articles")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="articles")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    desc = models.TextField()
    cover_photo = models.ImageField(upload_to="article_images/")
    rank_score = models.FloatField(default=0)
    frontend_static_page_generate = models.BooleanField(default=False)
    canonicial_link = models.CharField(max_length=255, default="")

    class Meta:
        ordering = ["-rank_score"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.canonicial_link = f"{settings.DOMAIN_URL}/articles/{self.slug}/detail"
        related_articles_titles = [
            article.title for article in self.category.articles.all()]
        if self.title in related_articles_titles:
            related_articles_titles.remove(self.title)
        tm = TextMatch(self.title, related_articles_titles)
        titles = tm.getMatches()
        articles = []
        for artObj in self.category.articles.all():
            if artObj.title != self.title:
                articles.append(Article.objects.get(title=artObj.title))
        try:
            self.related_articles.all().delete()
        except:
            print("new article added")
        for article in articles:
            if article.title != self.title and (Article.objects.filter(title=self.title).exists() == True):
                Related.objects.create(
                    parent_article=self, related_article=article)

        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return f"/articles/{self.slug}/detail"


class ArticlePart(models.Model):
    parent_article = models.ForeignKey(
        Article, related_name="article_parts", on_delete=models.CASCADE)
    desc = models.TextField()
    cover_photo = models.ImageField(
        upload_to="article_images/article_part_images/")
    image_dir = models.IntegerField(default=1)

    def save(self, *args, **kwargs):
        last_part = self.parent_article.article_parts.all().last()
        if last_part:
            if self.id != last_part.id:
                self.image_dir = self.image_dir*-1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.parent_article.title+" -- Part {"+str(self.id)+"}"


class Heart(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="hearted_articles", on_delete=models.CASCADE)

    def __str__(self):
        return self.article.title


class Pin(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="pinned_articles", on_delete=models.CASCADE)

    def __str__(self):
        return self.article.title


class Related(models.Model):
    parent_article = models.ForeignKey(
        Article, related_name="related_articles", on_delete=models.CASCADE)
    related_article = models.ForeignKey(Article, on_delete=models.CASCADE)


class ArticleProduct(models.Model):
    article = models.ForeignKey(
        Article, related_name="products", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.article.title+" -- "+self.product.title
