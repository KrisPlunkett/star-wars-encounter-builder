from rest_framework.routers import DefaultRouter

from recruiting_project.encounters.api import StarshipsModelViewSet, EncountersModelViewSet


api_router = DefaultRouter()
api_router.register(r'api/starships', StarshipsModelViewSet, basename='starships')
api_router.register(r'api/encounters', EncountersModelViewSet, basename='encounters')

urlpatterns = api_router.urls + [

]
