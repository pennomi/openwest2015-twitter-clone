from rest_framework import permissions


class ProfilePermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Anyone can view the User
        if request.method in permissions.SAFE_METHODS:
            return True

        # But only the user can edit themselves
        return obj == request.user


class MessagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Anyone can read the object
        if request.method in permissions.SAFE_METHODS:
            return True

        # Can't do anything else (ie. create a message) if anonymous
        if request.user.is_anonymous():
            return False
        return True

    def has_object_permission(self, request, view, obj):
        # Anyone can read the object
        if request.method in permissions.SAFE_METHODS:
            return True

        # But only the sender can edit/delete it
        return obj.user == request.user
