# Script de Deploy Alternativo da Edge Function make-proxy via API do Supabase
# Bypassa bloqueios do Windows Defender / Supabase CLI

$ProjectRef = "mufgwetfhfhhmhowbhjj"
$Slug = "make-proxy"

Write-Host "=== DEPLOY ALTERNATIVO SUPABASE EDGE FUNCTION ==="
Write-Host "Este script realiza o upload seguro direto para o Supabase sem usar a CLI."
Write-Host ""

$Token = Read-Host "Cole o seu Token de Acesso do Supabase (comeca com sbp_)"
if (-not $Token) {
    Write-Error "O Token de Acesso e obrigatorio."
    exit
}

# Ler o arquivo de codigo-fonte
$CodePath = Join-Path $PSScriptRoot "supabase\functions\make-proxy\index.ts"
if (-not (Test-Path $CodePath)) {
    Write-Error "Arquivo de codigo nao encontrado em: $CodePath"
    exit
}

$CodeContent = Get-Content -Path $CodePath -Raw -Encoding UTF8

# Montar o JSON do body
$Body = @{
    name = "make-proxy"
    slug = "make-proxy"
    body = $CodeContent
    verify_jwt = $false
} | ConvertTo-Json -Depth 100

$Uri = "https://api.supabase.com/v1/projects/$ProjectRef/functions/$Slug"

Write-Host "Enviando codigo para o Supabase..."
try {
    $Response = Invoke-RestMethod -Uri $Uri -Method Patch -Headers @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    } -Body $Body
    
    Write-Host ""
    Write-Host "✅ SUCESSO! A Edge Function foi implantada com sucesso no Supabase!" -ForegroundColor Green
    Write-Host "ID da Function: $($Response.id)"
} catch {
    Write-Error "Falha ao enviar: $_"
    if ($_.Exception.Response) {
        $Reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $ErrorBody = $Reader.ReadToEnd()
        Write-Host "Detalhes do Erro: $ErrorBody" -ForegroundColor Red
    }
}
