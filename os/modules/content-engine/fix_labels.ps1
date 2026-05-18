$path = "os/modules/content-engine/content-engine.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Correções cirúrgicas para o que aparece no dashboard
$content = $content.Replace("AtenÃ§Ã£o", "Atenção")
$content = $content.Replace("CrÃtico", "Crítico")
$content = $content.Replace("PublicaÃ§Ã£o", "Publicação")
$content = $content.Replace("AÃ‡Ã•ES", "AÇÕES")
$content = $content.Replace("LogÃstica", "Logística")

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Escritas principais corrigidas."
