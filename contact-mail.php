<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo '{"ok":false}'; exit;
}
$naam    = htmlspecialchars(trim($_POST['naam']    ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$bericht = htmlspecialchars(trim($_POST['bericht'] ?? ''), ENT_QUOTES, 'UTF-8');
if (!$naam || !$email || !$bericht) {
    http_response_code(400); echo '{"ok":false}'; exit;
}
$to      = 'marieke@meraki-greendesign.nl';
$subject = '=?UTF-8?B?' . base64_encode('Nieuw bericht via meraki-greendesign.nl') . '?=';
$body    = "Naam: $naam\r\nE-mail: $email\r\n\r\nBericht:\r\n$bericht";
$headers = implode("\r\n", [
    'From: website@meraki-greendesign.nl',
    "Reply-To: $email",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
]);
$sent = mail($to, $subject, $body, $headers);
echo $sent ? '{"ok":true}' : '{"ok":false}';
