import re


class Matcher(object):
    regex = r""

    def get_matches (self, text):
        return re.findall(self.regex, text)


class UsertagParser(Matcher):
    regex = r"@(\w+)"


class HashtagParser(Matcher):
    regex = r"#(\w+)"
