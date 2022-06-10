from django import template
from django.conf import settings
from django.utils.html import escape
from rest_framework.renderers import JSONRenderer

register = template.Library()


@register.simple_tag(takes_context=True)
def page_title(context, *args, **kwargs):
    """
    Returns the title for the page based on the given context.
    """
    return context.get('page_title')


@register.tag
def react_page_data(parser, token):
    """
    Creates a hidden field that contains a serialized json object of any page specific data.
    """
    return ReactPageDataNode()


class ReactPageDataNode(template.Node):
    """
    The rendering code for the react_page_data tag.
    """
    def render(self, context):
        page_data = context.get('js_page_data', {})

        return '<input type="hidden" value="{0}" id="page-data" />'.format(
            escape(JSONRenderer().render(page_data).decode())
        )


@register.tag
def react_app_js(parser, token):
    """
    Creates script tags containing js for a React app.
    """
    return ReactAppJsNode()


class ReactAppJsNode(template.Node):
    """
    The rendering code for the react_app_js tag.
    """
    def render(self, context):
        # Get the static path and build paths
        static_url = settings.STATIC_URL
        build_path = 'frontend/build/'

        # Compute what bundles we need
        bundles = [
            'vendor',
            'common',
            'bootstrap'
        ]

        # Add the front end bundle if one exists
        if context.get('front_end_path'):
            bundles.append(context.get('front_end_path'))

        # Convert our bundle names into script paths and add any external scripts
        script_paths = [
            '{static_url}{build_path}{bundle}.bundle.js'.format(
                static_url=static_url,
                build_path=build_path,
                bundle=bundle,
            )
            for bundle in bundles
        ] + context.get('external_scripts', [])

        # Build the scripts
        scripts = [
            '<script src="{script_path}"></script>'.format(script_path=script_path)
            for script_path in script_paths
        ]

        # Return the scripts
        return '\n'.join(scripts)


@register.tag
def react_app_css(parser, token):
    """
    Creates link tags containing css for a React app.
    """
    return ReactAppCssNode()


class ReactAppCssNode(template.Node):
    """
    The rendering code for the react_app_css tag.
    """
    def render(self, context):
        front_end_path = context.get('front_end_path')

        return '\n'.join([
            '<link rel="stylesheet" href="{0}frontend/build/core.css" />',
            '<link rel="stylesheet" href="{0}frontend/build/{1}.css" />',
            '<link rel="stylesheet" href="{0}frontend/build/bootstrap.css" />',
            '<link rel="stylesheet" href="{0}frontend/build/bootstrap-theme.min.css" />',
        ]).format(
            settings.STATIC_URL,
            front_end_path,
        )
