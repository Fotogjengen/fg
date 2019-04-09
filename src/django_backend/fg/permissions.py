from rest_framework.permissions import BasePermission, SAFE_METHODS
import _itkacl as itkacl

class IsFGOrReadOnly(BasePermission):
    """
    Object-level permission to only allow read-only operations.
    """
    message = "You must be in the FG group in order to edit this item."

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        user = request.user
        # return itkacl.check('/web/fg', user.username)
        return True


class IsFgOrPostOnly(BasePermission):
    """
    Object-level permission to only allow post-only operations by anon users
    """

    def has_permission(self, request, view):
        user = request.user
        return itkacl.check('/web/fg', user.username)


class IsFG(BasePermission):
    """Object level permission only allowing FG users"""
    message = "You must be in the FG group in order to see this item."

    def has_permission(self, request, view):
        user = request.user
        return itkacl.check('/web/fg', user.username)


class IsFgOrHusfolk(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""
    message = "You must be in the FG or HUSFOLK group in order to see this item."

    def has_permission(self, request, view):
        user = request.user
        return itkacl.check('/web/fg', user.username)


class IsFgOrHusfolkPostOnly(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""
    message = "You must be in the FG or HUSFOLK group in order to Post, only FG can get"

    def has_permission(self, request, view):
        user = request.user
        return itkacl.check('/web/fg', user.username)
