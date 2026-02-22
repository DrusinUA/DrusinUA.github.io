import re

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&amp;family=Comfortaa:wght@700&amp;family=Sniglet:wght@800&amp;family=Fredoka+One&amp;display=swap');
      .badge { fill: #36462b; }
      .badge-text { font-family: 'Playfair Display', serif; font-size: 26px; fill: #f3efe6; letter-spacing: 1px; }
      .letter { font-family: 'Sniglet', 'Fredoka One', cursive; font-size: 110px; fill: #382922; }
      .coco-outer { fill: #382922; }
      .coco-inner { fill: #f8f6f2; }
      .coco-shadow { fill: #e6e2d8; }
      .outline-group { stroke: #f8f6f2; stroke-width: 14; stroke-linejoin: round; stroke-linecap: round; }
    </style>
    <!-- Filter to create the thick white outline around the whole logo -->
    <filter id="outline">
      <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="10"></feMorphology>
      <feFlood flood-color="#f8f6f2" flood-opacity="1" result="BG"></feFlood>
      <feComposite in="BG" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
      <feMerge>
        <feMergeNode in="OUTLINE"></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  </defs>

  <!-- We use a group with the outline filter active -->
  <g filter="url(#outline)">
    <!-- Wavy Green Badge -->
    <!-- Matches the slight wave shown in the image -->
    <path class="badge" d="M 180 65 Q 250 50 320 55 L 320 95 Q 250 85 180 100 Z" />
    <text x="250" y="85" text-anchor="middle" class="badge-text">кафе</text>

    <!-- COCOS Text and Coconuts -->
    <!-- C -->
    <text x="110" y="180" text-anchor="middle" class="letter">C</text>
    
    <!-- O (Coconut) -->
    <g transform="translate(190, 142)">
      <circle cx="0" cy="0" r="32" class="coco-outer" />
      <circle cx="0" cy="0" r="22" class="coco-inner" />
      <!-- Shadow crescent -->
      <path d="M -15 -15 A 22 22 0 0 0 -15 15 A 28 28 0 0 1 -15 -15 Z" class="coco-shadow" />
    </g>

    <!-- C -->
    <text x="270" y="180" text-anchor="middle" class="letter">C</text>

    <!-- O (Coconut) -->
    <g transform="translate(350, 142)">
      <circle cx="0" cy="0" r="32" class="coco-outer" />
      <circle cx="0" cy="0" r="22" class="coco-inner" />
      <!-- Shadow crescent -->
      <path d="M -15 -15 A 22 22 0 0 0 -15 15 A 28 28 0 0 1 -15 -15 Z" class="coco-shadow" />
    </g>

    <!-- S -->
    <text x="430" y="180" text-anchor="middle" class="letter">S</text>
  </g>
</svg>"""

with open('public/logo.svg', 'w') as f:
    f.write(svg_content)
print("Generated public/logo.svg")
