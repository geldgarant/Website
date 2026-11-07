<?php
// Voorbeeld-PDF van een CaseControl-template maken met dezelfde motor als CaseControl (dompdf 3.1).
// Gebruik: DOMPDF_LIB=/pad/naar/lib php brieven/tools/render-cc.php <template.html> <voorbeeld.json> <uit.pdf>
// - Het template gebruikt de echte CaseControl-variabelen ({{debtor.name}} enz.); het JSON-bestand geeft per variabele
//   een voorbeeldwaarde ({"debtor.name": "EANA Transport", ...}). Variabelen zonder waarde worden gemeld.
// - Pagina-instellingen zoals bij CaseControl (gemeten in hun PDF van 7 nov 2026): A4, marges 20 mm rondom,
//   standaardlettertype Roboto (hier niet aanwezig; het template zet zelf Helvetica/Arial).
$lib = getenv('DOMPDF_LIB') ?: __DIR__ . '/lib';
spl_autoload_register(function ($c) use ($lib) {
    if ($c === 'Dompdf\\Cpdf') return require "$lib/dompdf/lib/Cpdf.php";
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
$html = file_get_contents($tpl);
// volledige export uit CaseControl (met DOCTYPE/body) of alleen de inhoud: allebei goed
if (preg_match('#<body[^>]*>(.*)</body>#s', $html, $m)) $html = $m[1];
$html = preg_replace_callback('/\{\{\s*([a-z0-9_.]+)\s*\}\}/i', function ($m) use ($data) {
    if (array_key_exists($m[1], $data)) return $data[$m[1]];
    fwrite(STDERR, "Geen voorbeeldwaarde: {$m[1]}\n");
    return $m[0];
}, $html);
$marge = getenv('MARGE') ?: '20mm';
$html = "<!DOCTYPE html><html lang=\"nl\"><head><meta charset=\"utf-8\"><style>@page{margin:$marge}</style></head><body>$html</body></html>";
$o = new Dompdf\Options();
$o->set('isRemoteEnabled', false); // zoals bij CaseControl: externe afbeeldingen laden daar niet
$o->set('fontCache', sys_get_temp_dir());
$o->set('defaultFont', 'Helvetica');
$d = new Dompdf\Dompdf($o);
$d->loadHtml($html, 'UTF-8');
$d->setPaper('A4');
$d->render();
file_put_contents($uit, $d->output());
echo "PDF: $uit\n";
