from shapely import wkb


def main():
    wkb_hex = "0101000020E61000002203530B24524EC0F04CD90C2F7A40C0"

    wkb_bytes = bytes.fromhex(wkb_hex)

    geom = wkb.loads(wkb_bytes)

    longitude = geom.x
    latitude = geom.y

    print(f"Longitude: {longitude}")
    print(f"Latitude: {latitude}")


if __name__ == "__main__":
    main()
