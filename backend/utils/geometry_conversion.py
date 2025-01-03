from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import Point

from custom_types import GeometryPoint


def wkb_element_to_geometry_point(wkb_element) -> GeometryPoint:
    """Converts a WKBElement to a GeometryPoint."""
    point = to_shape(wkb_element)
    return GeometryPoint(coordinates=list(point.coords[0]))


def geometry_point_to_wkb_element(geometry_point: GeometryPoint):
    """Converts a GeometryPoint to a WKBElement."""
    point = Point(geometry_point.coordinates)
    return from_shape(point)
