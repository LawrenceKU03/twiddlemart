from django.contrib.sitemaps import Sitemap
from apps.articles.models import Article


class StaticViewSitemap(Sitemap):
    def items(self):
        return ["", "articles", "about-us", "privacy-policy"]

    def location(self, item):
        return "/"+item


class ArticlesViewSitemap(Sitemap):
    def items(self):
        return Article.objects.all()
