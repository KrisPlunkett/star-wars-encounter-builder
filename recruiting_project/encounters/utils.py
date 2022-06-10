from collections import defaultdict

from recruiting_project.encounters.models import Encounter, Mob


def get_encounter_starship_classes(encounter_ids=None):
    """
    Get a set of starship class names for all encounters

    :param encounter_ids: A specific list of encounters to scope this operation, else grab all encounters
    """
    if encounter_ids is None:
        encounter_ids = []

    # if not encounter_ids, just get all encounters
    if not encounter_ids:
        for encounter in Encounter.objects.all():
            encounter_ids.append(encounter.id)

    # get unique starship classes for each encounters
    mobs = Mob.objects.filter(
        encounter_id__in=encounter_ids
    ).values_list(
        'encounter_id',
        'starship__starship_class__name',
    )

    encounter_starship_classes = defaultdict(set)
    for mob in mobs:
        encounter_starship_classes[mob[0]].add(mob[1])

    return encounter_starship_classes
