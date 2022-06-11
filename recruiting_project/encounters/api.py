from rest_framework.viewsets import ModelViewSet

from recruiting_project.encounters.models import Starship, Encounter
from recruiting_project.encounters.serializers import StarshipSerializer, EncounterSerializer


class StarshipsModelViewSet(ModelViewSet):
    """
    Model viewset for starships API
    """
    serializer_class = StarshipSerializer

    def get_queryset(self):
        q = self.request.query_params.get("q")
        if q:
            name_queryset = Starship.objects.filter(name__icontains=q)
            model_queryset = Starship.objects.filter(model__icontains=q)
            class_name_queryset = Starship.objects.filter(starship_class__name__icontains=q)
            return name_queryset.union(model_queryset, class_name_queryset)
        else:
            return Starship.objects.all()



class EncountersModelViewSet(ModelViewSet):
    """
    Model viewset for encounters API
    """
    serializer_class = EncounterSerializer

    def get_queryset(self):
        return Encounter.objects.all().prefetch_related('mobs__starship')
