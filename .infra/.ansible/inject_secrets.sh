#!/bin/bash

# Define the target file
TARGET_FILE=".env"

# Loop through all GitLab CI variables starting with "SECRET_"
for var in $(compgen -e); do
    if [[ $var == SECRET_* ]]; then
        if grep -q "$var" $TARGET_FILE; then
            # Replace the variable in the target file with its value
            sed -i "s|$var|${!var}|g" "$TARGET_FILE"
            echo "Replaced '$var' in $TARGET_FILE."
        fi
    fi
done

awk '{for(i=1;i<=NF;i++) if ($i ~ /^SECRET_/) print $i}' $TARGET_FILE

# Append or update NEXT_PUBLIC_VERSION in .env
if [ -f VERSION ]; then
    echo "Adding/updating version info from VERSION file to $TARGET_FILE."
    version_line=$(cat VERSION)
    public_version_line="NEXT_PUBLIC_${version_line}"
    
    if grep -q '^NEXT_PUBLIC_VERSION=' "$TARGET_FILE"; then
        sed -i "s|^NEXT_PUBLIC_VERSION=.*|$public_version_line|" "$TARGET_FILE"
        echo "Updated NEXT_PUBLIC_VERSION in $TARGET_FILE."
    else
        echo "$public_version_line" >> "$TARGET_FILE"
        echo "Appended NEXT_PUBLIC_VERSION to $TARGET_FILE."
    fi
fi

echo "Replacements and version update completed in $TARGET_FILE."
