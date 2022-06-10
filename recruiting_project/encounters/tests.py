from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from django_dynamic_fixture import G

from recruiting_project.encounters.models import Encounter, Mob, Starship, StarshipClass
from recruiting_project.encounters.utils import get_encounter_starship_classes


class IndexStarshipsCommandTest(TestCase):
    """
    Tests for the process that retrieves and indexes starships from the SWAPI
    """
    def test_index_starships(self):
        # Index starships
        call_command('index_starships')

        # Verify that starships were indexed, should be more than one
        self.assertGreater(Starship.objects.count(), 1)


class UtilsTests(TestCase):
    """
    Tests for utils methods
    """
    def test_get_encounter_starship_classes(self):
        fighter = G(StarshipClass, name='fighter')
        cruiser = G(StarshipClass, name='cruiser')
        xwing = G(Starship, starship_class=fighter, name='x-wing')
        awing = G(Starship, starship_class=fighter, name='a-wing')
        correllian_cruiser = G(Starship, starship_class=cruiser, name='correllian cruiser')

        # Create an encounter with two starships
        encounter1 = G(Encounter)
        G(Mob, starship=xwing, encounter=encounter1)
        G(Mob, starship=correllian_cruiser, encounter=encounter1)

        # get the starship classes for all encounters
        encounter_starship_classes = get_encounter_starship_classes()

        # Verify results
        self.assertEqual(1, len(encounter_starship_classes))
        self.assertEqual(
            {'fighter', 'cruiser'},
            encounter_starship_classes[encounter1.id]
        )

        # create a new encounter
        encounter2 = G(Encounter)
        G(Mob, starship=awing, encounter=encounter2)

        # get the starship classes for all encounters
        encounter_starship_classes = get_encounter_starship_classes()

        # Verify results, making sure the new encounter is included in results
        self.assertEqual(2, len(encounter_starship_classes))
        self.assertEqual(
            {'fighter', 'cruiser'},
            encounter_starship_classes[encounter1.id]
        )
        self.assertEqual(
            {'fighter'},
            encounter_starship_classes[encounter2.id]
        )

class APITest(TestCase):
    """
    Tests for the API's
    """
    def test_starships_api_filter(self):
        """
        Verify that the filters are working as expected
        """
        # Create some starships with different starship classes to filter on
        fighter = G(StarshipClass, name='fighter')
        cruiser = G(StarshipClass, name='cruiser')
        G(Starship, starship_class=fighter, name='x-wing')
        G(Starship, starship_class=fighter, name='a-wing')
        G(Starship, starship_class=fighter, name='tie fighter')
        G(Starship, starship_class=cruiser, name='correllian cruiser')

        # Make the request for all fighter starships
        c = Client()
        # Filter by starship class name
        data = {
            'starship_class__name': 'fighter'
        }
        response = c.get(reverse('starships-list'), data=data)

        # Confirm that there are three starships in the response
        self.assertEqual(3, len(response.json()['results']))

    def test_encounters_api_performance(self):
        """
        Verify that we're not performing more queries than necessary
        """
        # Create an encounter
        encounter = Encounter.objects.create(name='Foo Encounter')

        # Add some mobs
        starship = G(
            Starship,
            name='x-wing',
            starship_class=G(StarshipClass, name='fighter')
        )
        G(Mob, starship=starship, encounter=encounter)
        G(Mob, starship=starship, encounter=encounter)
        G(Mob, starship=starship, encounter=encounter)

        # Retrieve results from the API, raising exception if number of database queries exceeds our expectation
        c = Client()
        with self.assertNumQueries(4):
            response = c.get(reverse('encounters-list'))
