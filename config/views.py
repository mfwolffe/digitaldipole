import json

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.generic import TemplateView


class HomeView(TemplateView):
    """
    Main view serving the React SPA.
    Publicly accessible - authentication handled in frontend for specific features.
    """
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        user = self.request.user
        context_data.update({
            "username": user.username if user.is_authenticated else "",
            "is_authenticated": user.is_authenticated,
            "user_id": user.id if user.is_authenticated else None,
        })
        return context_data

