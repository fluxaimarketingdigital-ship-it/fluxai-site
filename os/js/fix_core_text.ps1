$path = "os/js/os-core.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Correções para a sidebar e core UI
$content = $content.Replace("InteligÃªncia", "Inteligência")
$content = $content.Replace("AnÃ¡lise", "Análise")
$content = $content.Replace("GestÃ£o", "Gestão")
$content = $content.Replace("UsuÃ¡rios", "Usuários")
$content = $content.Replace("GovernanÃ§a", "Governança")
$content = $content.Replace("AutomaÃ§Ã£o", "Automação")
$content = $content.Replace("usuǭrio", "usuário")
$content = $newContent = $content.Replace('OS"', 'OS™')

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Menus corrigidos."
