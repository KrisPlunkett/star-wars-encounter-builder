# import multiprocessing to avoid this bug (http://bugs.python.org/issue15881#msg170215)
from os import path
import multiprocessing
assert multiprocessing
from setuptools import setup, find_packages

from recruiting_project import VERSION


def get_install_requires():
    """
    Gets a list of requirements from requirements.txt.
    """
    with open(path.join(path.dirname(__file__), 'requirements.txt')) as requirements_file:
        requirements = requirements_file.readlines()

    requirements = [r.strip() for r in requirements if r.strip()]

    return [
        r for r in requirements
        if not r.startswith('#') and not r.startswith('-')
    ]


setup(
    name='recruiting_project',
    version=VERSION,
    description='Office productivity with a purpose',
    long_description=open(path.join(path.dirname(__file__), 'README.md')).read(),
    author='',
    author_email='team@ambition.com',
    keywords='Ambition Recruiting Projcet',
    packages=find_packages(),
    classifiers=[
        'Programming Language :: Python',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Framework :: Django',
        'Private :: Do Not Upload',
    ],
    tests_require=[
        'django-extensions>=1.6.7',
        'django-dynamic-fixture',
        'ambition-inmemorystorage>=1.4.1',
        'django-nose>=1.4',
        'freezegun>=0.2.8',
        'mock>=1.0.1',
        'funcsigs',
    ],
    install_requires=get_install_requires(),
    include_package_data=True,
    zip_safe=False,
)
