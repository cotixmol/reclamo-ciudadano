from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import Point
from custom_types import GeometryPoint
from errors import ClaimNotConvertedError


def validate_coordinates(coords):
    """
    Validates that the given coordinates represent a valid geographic position.
    Coordinates should be in the form (longitude, latitude) and within the ranges:
      - longitude: -180 <= longitude <= 180
      - latitude:  -90 <= latitude <= 90
    Raises ClaimNotConvertedError if these conditions are not met.
    """
    if len(coords) != 2:
        raise ClaimNotConvertedError(
            message="Invalid coordinate format. Expected a pair: (longitude, latitude)."
        )

    longitude, latitude = coords
    if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
        raise ClaimNotConvertedError(
            message=(
                "Invalid coordinate values. Longitude must be between -180 and 180, "
                "and latitude between -90 and 90."
            )
        )
    return longitude, latitude


def wkb_element_to_geometry_point(wkb_element) -> GeometryPoint:
    """
    Converts a WKBElement to a GeometryPoint by extracting the (longitude, latitude)
    coordinates and validating them. Raises ClaimNotConvertedError if the WKBElement
    is invalid or contains out-of-range coordinates.
    """
    try:
        point = to_shape(wkb_element)
        coords = list(point.coords[0])
        validate_coordinates(coords)
        return GeometryPoint(coordinates=coords)
    except ClaimNotConvertedError:
        # Re-raise to maintain the original context for coordinate validation failures
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Failed to convert WKBElement to GeometryPoint: {e}", errors=e
        )


def geometry_point_to_wkb_element(geometry_point: GeometryPoint):
    """
    Converts a GeometryPoint (or a dict with a 'coordinates' key) into a WKBElement
    for storage in the database. Raises ClaimNotConvertedError if the coordinates
    are invalid or the conversion fails.
    """
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
        # Re-raise to maintain the original context for coordinate validation failures
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Failed to convert GeometryPoint to WKBElement: {e}", errors=e
        )


def update_claim_request_element_to_geometry_point(coords):
    """
    Converts raw coordinate data from a claim update request into a valid GeometryPoint.
    Raises ClaimNotConvertedError if the coordinates are invalid or the conversion fails.
    """
    try:
        validate_coordinates(coords)
        return GeometryPoint(coordinates=coords)
    except ClaimNotConvertedError:
        # Re-raise to maintain the original context for coordinate validation failures
        raise
    except Exception as e:
        raise ClaimNotConvertedError(
            message=f"Failed to convert claim request element to GeometryPoint: {e}",
            errors=e,
        )
