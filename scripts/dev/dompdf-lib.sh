#!/usr/bin/env bash
# Haalt dompdf en afhankelijkheden op (zelfde motor als CaseControl) voor brieven/tools/render-cc.php.
# Packagist is in de cloudomgeving geblokkeerd, GitHub niet. Gebruik: bash scripts/dev/dompdf-lib.sh [doelmap]
set -euo pipefail
DOEL="${1:-/home/claude/brief/lib}"
mkdir -p "$DOEL" && cd "$DOEL"
haal() { [ -d "$2" ] || git clone -q --depth 1 --branch "$3" "https://github.com/$1.git" "$2"; }
haal dompdf/dompdf dompdf v3.1.4
haal dompdf/php-font-lib php-font-lib 1.0.1
haal dompdf/php-svg-lib php-svg-lib 1.0.0
haal Masterminds/html5-php html5-php 2.9.0
haal MyIntervals/PHP-CSS-Parser PHP-CSS-Parser v8.8.0
echo "Klaar: DOMPDF_LIB=$DOEL"
