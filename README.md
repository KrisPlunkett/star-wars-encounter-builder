### Brief

This project is a Django application that acts as an encounter builder for a Star Wars tabletop RPG.
It uses starship data from the [Star Wars API](https://swapi.dev/) to allow a game master to build custom
or random space encounters for players.

### Objective

This project is meant to gauge your ability to take requirements and apply them by extending an existing application similar to our own.

### Getting Started

```
cd path/to/recruiting-project
virtualenv -p `which python3` venv
source venv/bin/activate
pip install -r requirements.txt
npm run build
python manage.py migrate
python manage.py index_starships
```

At this point, you should be able to run the dev server and access it locally in your browser.


### Requirements/Plan

You will add several capabilities to the existing application:

- As a user, I want to be able to filter the starships table by name, model, or starship class name, so that I can quickly access the starships I want to add to the encounter ([Issue #1](https://github.com/KrisPlunkett/star-wars-encounter-builder/issues/1))
- As a user, I want to be able to see a list of the starships I've added to an encounter that I'm editing, so that I know what I've added ([Issue #2](https://github.com/KrisPlunkett/star-wars-encounter-builder/issues/2))
- As a user, I want the list of added starships to include the ability to remove any starship from the encounter ([Issue #3](https://github.com/KrisPlunkett/star-wars-encounter-builder/issues/3))
- As a user, I want to be able to create an encounter that includes the starships I've added ([Issue #4](https://github.com/KrisPlunkett/star-wars-encounter-builder/issues/4))

1. ~~Add the starship class names to the table columns~~ (Resolved by [Pull Request #6](https://github.com/KrisPlunkett/star-wars-encounter-builder/pull/6))
2. ~~Implement a change handler for the search input, live-filtering the table data based on a comparison of the input text and a union of starship name, model, and starship class name~~ (Resolved by [Pull Request #8](https://github.com/KrisPlunkett/star-wars-encounter-builder/pull/8))
3. ~~Finish implementing the add button by adding a click handler that adds the associated starship to the encounter being edited~~ (Resolved by [Pull Request #9](https://github.com/KrisPlunkett/star-wars-encounter-builder/pull/9))
4. ~~Create a new React component that will take the place of the existing `ul#encounter-starships`. The component should be a list of added starships, each with a button to remove from the encounter.~~ (Resolved by [Pull Request #10](https://github.com/KrisPlunkett/star-wars-encounter-builder/pull/10))
5. ~~Add a django form/view that takes a list of starships and creates an encounter with the given starships~~ (Resolved by [Pull Request #11](https://github.com/KrisPlunkett/star-wars-encounter-builder/pull/11))
6. Finish implementing the "Create Encounter" button by adding a click handler that posts the form via ajax

Once you're ready to submit, package the project as a compressed file, and share a link to the compressed package. Please be prepared to demo your project live in our technical interview.

