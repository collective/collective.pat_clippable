# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import collective.pat_clippable


class CollectivePatClippableLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import plone.restapi
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=collective.pat_clippable)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'collective.pat_clippable:default')


COLLECTIVE_PAT_CLIPPABLE_FIXTURE = CollectivePatClippableLayer()


COLLECTIVE_PAT_CLIPPABLE_INTEGRATION_TESTING = IntegrationTesting(
    bases=(COLLECTIVE_PAT_CLIPPABLE_FIXTURE,),
    name='CollectivePatClippableLayer:IntegrationTesting',
)


COLLECTIVE_PAT_CLIPPABLE_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(COLLECTIVE_PAT_CLIPPABLE_FIXTURE,),
    name='CollectivePatClippableLayer:FunctionalTesting',
)


COLLECTIVE_PAT_CLIPPABLE_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        COLLECTIVE_PAT_CLIPPABLE_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='CollectivePatClippableLayer:AcceptanceTesting',
)
