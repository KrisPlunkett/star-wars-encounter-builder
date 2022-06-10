from rest_framework.viewsets import ModelViewSet

from recruiting_project.encounters.models import Starship, Encounter
from recruiting_project.encounters.serializers import StarshipSerializer, EncounterSerializer


class StarshipsModelViewSet(ModelViewSet):
    """
    Model viewset for starships API
    """
    queryset = Starship.objects.all()
    serializer_class = StarshipSerializer
    filterset_fields = (
        'starship_class__name',
    )


class EncountersModelViewSet(ModelViewSet):
    """
    Model viewset for encounters API
    """
    serializer_class = EncounterSerializer

    def get_queryset(self):
        return Encounter.objects.all().prefetch_related('mobs__starship')
