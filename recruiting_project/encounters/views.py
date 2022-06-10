from django.shortcuts import render
from django.views.generic import TemplateView


class BaseEncounterView(TemplateView):

    # The template to use
    template_name = 'base_react.html'

    # The path to the frontend bundle
    front_end_path = None

    def get_front_end_path(self):
        """
        Gets the path for the view's static files.
        Should be overridden for fancy-pants paths.
        Path uses a 'app_name/build/filename' format.
        """
        return self.front_end_path

    def get_page_title(self):
        """
        Sets a uniform page title for the view.
        """
        return getattr(self, 'page_title', 'Star Wars Encounters')

    def get_js_page_data(self):
        return {}

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Set the default context values
        context['front_end_path'] = self.get_front_end_path()
        context['page_title'] = self.get_page_title()

        # Set the default page data
        context['js_page_data'] = self.get_js_page_data()

        return context


class EncounterBuilderView(BaseEncounterView):

    page_title = 'Encounter Builder'
    front_end_path = 'encounters/builder'

