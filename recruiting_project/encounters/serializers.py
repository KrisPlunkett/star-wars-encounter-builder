from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField

from recruiting_project.encounters.models import Starship, Encounter, Mob


class StarshipSerializer(ModelSerializer):

    class Meta:
        model = Starship
        fields = [
            'name',
            'model',
            'starship_class',
            'cost_in_credits',
            'crew',
            'passengers',
            'cargo_capacity',
            'created_at',
            'modified_at',
        ]


class MobSerializer(ModelSerializer):
    starship_name = CharField(source='starship.name', read_only=True)

    class Meta:
        model = Mob
        fields = [
            'starship_name',
        ]


class EncounterSerializer(ModelSerializer):
    mobs = SerializerMethodField()

    class Meta:
        model = Encounter
        fields = [
            'name',
            'mobs',
        ]

    def get_mobs(self, instance):
        return MobSerializer(instance.mobs, many=True).data

