from rest_framework.serializers import (
    CharField,
    IntegerField,
    ListField,
    ModelSerializer,
    SerializerMethodField,
)

from recruiting_project.encounters.models import Starship, Encounter, Mob


class StarshipSerializer(ModelSerializer):
    starship_class_name = CharField(source='starship_class.name', read_only=True)

    class Meta:
        model = Starship
        fields = [
            'id',
            'name',
            'model',
            'starship_class_id',
            'starship_class_name',
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


class EncounterListSerializer(ModelSerializer):
    mobs = SerializerMethodField()

    class Meta:
        model = Encounter
        fields = [
            'mobs',
            'name',
            'notes',
        ]

    def get_mobs(self, instance):
        return MobSerializer(instance.mobs, many=True).data


class EncounterCreateSerializer(ModelSerializer):
    mobs = ListField(
        min_length=1,
        allow_empty=False,
        write_only=True,
        child=IntegerField(min_value=1)  # Starship ID's from SWAPI start at 1
    )

    class Meta:
        model = Encounter
        fields = [
            'mobs',
            'name',
            'notes',
        ]

    def create(self, validated_data):
        encounter = Encounter.objects.create(name=validated_data.get('name'), notes=validated_data.get('notes'))
        for mob in validated_data.get('mobs'):
            starship = Starship.objects.get(id=mob)
            Mob.objects.create(encounter=encounter, starship=starship)
        return encounter
