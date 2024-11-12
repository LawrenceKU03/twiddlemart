
from django.http import Http404
from django_nextjs.render import render_nextjs_page_sync


def index(request):
    return render_nextjs_page_sync(request)


def about_us(request):
    return render_nextjs_page_sync(request)


def privacy_policy(request):
    return render_nextjs_page_sync(request)


def signup(request):
    return render_nextjs_page_sync(request)


def login(request):
    return render_nextjs_page_sync(request)


def articles(request):
    return render_nextjs_page_sync(request)


def article_detail(request, slug):
    return render_nextjs_page_sync(request)


def store(request):
    return render_nextjs_page_sync(request)


def store_product_detail(request, id):
    return render_nextjs_page_sync(request)


def dashboard(request):
    return render_nextjs_page_sync(request)


def search(request):
    return render_nextjs_page_sync(request)


def auth_reset(request, slug):
    return render_nextjs_page_sync(request)


def auth_reset_password(request, hash, id):
    return render_nextjs_page_sync(request)


def uni_nextjs_page_view(request, *args, **kwargs):
    res = render_nextjs_page_sync(request)
    print("STATUS CODE:{}".format(res.status_code))
    if res.status_code == 404:
        raise Http404

    return render_nextjs_page_sync(request)
