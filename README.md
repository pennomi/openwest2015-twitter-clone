# Django / DRF / Angular Demo App for OpenWest 2015

To get set up follow the steps:

```
# Clone the repository
git clone https://github.com/pennomi/openwest2015-twitter-clone.git
cd openwest2015-twitter-clone

# Create a virtualenv
mkvirtualenv --python=/usr/bin/python3 twitter-clone

# Install the requirements
pip install -r requirements.txt

# Migrate the django test database
./manage.py migrate

# Run the test server
./manage.py runserver
```
