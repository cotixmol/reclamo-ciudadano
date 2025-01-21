from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import Point
from custom_types import GeometryPoint
from errors import ClaimNotConvertedError


def validate_coordinates(coords):
    """Validates that coordinates are in the correct format and range."""
    if len(coords) != 2:
        raise ClaimNotConvertedError(
            message="Invalid coordinates: Expected (longitude, latitude)"
        )
    longitude, latitude = coords
    if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
        raise ClaimNotConvertedError(
            message="Invalid coordinates: Longitude (-180 to 180) and latitude (-90 to 90)"
        )
    return longitude, latitude


def wkb_element_to_geometry_point(wkb_element) -> GeometryPoint:
    """Converts a WKBElement to a GeometryPoint."""
    try:
        point = to_shape(wkb_element)
        coords = list(point.coords[0])
        validate_coordinates(coords)
        return GeometryPoint(coordinates=coords)
    except ClaimNotConvertedError:
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Error converting WKBElement to GeometryPoint: {e}", errors=e
        )


def geometry_point_to_wkb_element(geometry_point: GeometryPoint):
    """Converts a GeometryPoint to a WKBElement."""
    try:
        coords = (
            geometry_point.coordinates
            if isinstance(geometry_point, GeometryPoint)
            else geometry_point.get("coordinates")
        )
        validate_coordinates(coords)
        point = Point(coords)
        return from_shape(point)
    except ClaimNotConvertedError:
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Error converting GeometryPoint to WKBElement: {e}", errors=e
        )


def update_claim_request_element_to_geometry_point(coords):
    """Converts a claim request element to a GeometryPoint."""
    try:
        validate_coordinates(coords)
        return GeometryPoint(coordinates=coords)
    except ClaimNotConvertedError:
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Error converting claim request element to GeometryPoint: {e}",
            errors=e,
        )
