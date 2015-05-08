from django.test import TestCase

from .tools import UsertagParser, HashtagParser

# Create your tests here.
class UsertagParserTestCase(TestCase):
    def __init__(self, *args, **kwargs):
        # Create the parser so we can use it in our tests.
        self.parser = UsertagParser()
        super().__init__(*args, **kwargs)

    def test_matches_single_tag(self):
        text = "@izeni"
        matches = self.parser.get_matches(text)
        self.assertEqual(len(matches), 1)

    def test_matches_multiple_tags(self):
        text = "@izeni @openwest"
        matches = self.parser.get_matches(text)
        self.assertEqual(len(matches), 2)

    def test_matches_only_at_sign(self):
        text = "@openwest #openwest"
        matches = self.parser.get_matches(text)
        self.assertEqual(len(matches), 1)
