#!/usr/bin/env fontforge
import fontforge

# Open the original fon
# t file
font = fontforge.open("menulis.ttf")


# Set the OS/2 weight to Bold (700 is standard for bold)
font.os2_weight = 700

# Increase the stroke weight for each glyph
# The value '20' is an example; adjust it for the desired boldness.
for glyph in font.glyphs():
    glyph.changeWeight(20, "auto")

# Generate the new bold font file
font.generate("menulis-bold.ttf")
print("Bold font generated successfully as 'menulis-bold.ttf'.")
