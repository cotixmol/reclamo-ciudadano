from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import Point
from custom_types import GeometryPoint


def wkb_element_to_geometry_point(wkb_element) -> GeometryPoint:
    """Converts a WKBElement to a GeometryPoint."""
    point = to_shape(wkb_element)
    coords = list(point.coords[0])

    # Validate coordinates
    if len(coords) != 2:
        raise ValueError("Invalid coordinates: Expected (longitude, latitude)")
    longitude, latitude = coords
    if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
        raise ValueError(
            "Invalid coordinates: Longitude (-180 to 180) and latitude (-90 to 90)"
        )

    return GeometryPoint(coordinates=coords)


def geometry_point_to_wkb_element(geometry_point: GeometryPoint):
    """Converts a GeometryPoint to a WKBElement."""
    coords = geometry_point.get("coordinates")

    if len(coords) != 2:
        raise ValueError("Invalid coordinates: Expected (longitude, latitude)")
    longitude, latitude = coords
    if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
        raise ValueError(
            "Invalid coordinates: Longitude (-180 to 180) and latitude (-90 to 90)"
        )

    point = Point(coords)
    return from_shape(point)
