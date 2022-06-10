from django.db import models


class StarshipClass(models.Model):
    """
    Starship classes (e.g. "Starfighter", "Deep Space Mobile Battlestation")
    """
    name = models.CharField(max_length=256)


class Starship(models.Model):
    """
    Starships that are indexed from the Star Wars API and used in encounters
    """
    # The SWAPI hypermedia url for this starship
    swapi_url = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    model = models.CharField(max_length=256)
    starship_class = models.ForeignKey(StarshipClass, on_delete=models.PROTECT)
    # The cost in galactic credits, typically used to gauge the difficulty in combat
    cost_in_credits = models.IntegerField(null=True)
    # The number of personnel needed to run or pilot the starship
    crew = models.IntegerField(null=True)
    # The number of non-essential people this starship can transport
    passengers = models.IntegerField(null=True)
    # Maximum number of kilograms that this starship can transport
    cargo_capacity = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class Encounter(models.Model):
    """
    Encounters with hostile starships, along with notes from the game master
    """
    # A name for the encounter
    name = models.CharField(max_length=256)
    # Any notes the GM wants to reference later
    notes = models.TextField(null=True)


class Mob(models.Model):
    """
    Mobs (hostile starships) associated with an encounter
    """
    starship = models.ForeignKey(Starship, on_delete=models.PROTECT)
    encounter = models.ForeignKey(Encounter, related_name='mobs', on_delete=models.PROTECT)
