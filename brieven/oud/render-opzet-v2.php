<?php
// Voorbeeld-PDF van een brieftemplate maken met dezelfde motor als CaseControl (dompdf 3.1).
// Gebruik: DOMPDF_LIB=/pad/naar/lib php brieven/tools/render.php brieven/sommatie-b2b.html brieven/voorbeeld/sommatie-b2b.json uit.pdf
// DOMPDF_LIB bevat klonen van dompdf/dompdf, dompdf/php-font-lib, dompdf/php-svg-lib, Masterminds/html5-php en
// MyIntervals/PHP-CSS-Parser (zie brieven/README.md). Tokens [[NAAM]] worden vervangen uit het JSON-bestand.
$lib = getenv('DOMPDF_LIB') ?: __DIR__ . '/lib';
$map = [
    'Dompdf\\Cpdf' => "$lib/dompdf/lib/Cpdf.php",
];
spl_autoload_register(function ($c) use ($lib, $map) {
    if (isset($map[$c])) return require $map[$c];
    $pre = [
        'Dompdf\\' => "$lib/dompdf/src/",
        'FontLib\\' => "$lib/php-font-lib/src/FontLib/",
        'Svg\\' => "$lib/php-svg-lib/src/Svg/",
        'Masterminds\\' => "$lib/html5-php/src/",
        'Sabberworm\\CSS\\' => "$lib/PHP-CSS-Parser/src/",
    ];
    foreach ($pre as $p => $d) {
        if (strpos($c, $p) === 0) {
            $f = $d . str_replace('\\', '/', substr($c, strlen($p))) . '.php';
            if (is_file($f)) return require $f;
        }
    }
});
[$_, $tpl, $json, $uit] = $argv;
$data = json_decode(file_get_contents($json), true);
// relatieve paden (bv. "public/brief") gelden vanaf de hoofdmap van de repo
$root = dirname(__DIR__, 2);
foreach (['ASSETS', 'QR_URL'] as $k) {
    if (isset($data[$k]) && !preg_match('#^(https?:)?/#', $data[$k])) $data[$k] = "$root/" . $data[$k];
}
$html = file_get_contents($tpl);
foreach ($data as $k => $v) $html = str_replace("[[$k]]", $v, $html);
if (preg_match_all('/\[\[[A-Z_]+\]\]/', $html, $m)) fwrite(STDERR, "Niet vervangen: " . implode(', ', array_unique($m[0])) . "\n");
// CaseControl levert alleen de inhoud; zelfde omhulling als bij hen
$html = "<!DOCTYPE html><html lang=\"nl\"><head><meta charset=\"utf-8\"></head><body>$html</body></html>";
$o = new Dompdf\Options();
$o->set('isRemoteEnabled', true);
$o->set('chroot', [dirname(__DIR__, 2)]);
$o->set('fontCache', sys_get_temp_dir());
$o->set('defaultFont', 'Helvetica');
$d = new Dompdf\Dompdf($o);
$d->loadHtml($html, 'UTF-8');
$d->setPaper('A4');
$d->render();
file_put_contents($uit, $d->output());
echo "PDF: $uit\n";
