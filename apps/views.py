from django_nextjs.render import render_nextjs_page_sync


def error_404(request, exception):
    return render_nextjs_page_sync(request)


def error_500(request):
    return render_nextjs_page_sync(request)
