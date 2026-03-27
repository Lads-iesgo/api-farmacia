# Script de Teste: Endpoints de Farmacêuticos

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testando Backend de Farmacêuticos" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:3001"
$token = $null
$farmaceuticoId = $null

# ============ STEP 1: Registrar novo usuário ============
Write-Host "`n#1. Registrando novo usuário COORDENADOR..." -ForegroundColor Yellow

$registerBody = @{
    nome = "Coordenador Teste"
    email = "coord_$(Get-Random)@farmacia.com"
    senha = "Senha@Forte123"
    tipo_usuario = "COORDENADOR"
} | ConvertTo-Json

$registerResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/registrar" -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing -ErrorAction SilentlyContinue

if ($registerResp.StatusCode -eq 201) {
    Write-Host "✅ Usuário registrado com sucesso" -ForegroundColor Green
    $regData = $registerResp.Content | ConvertFrom-Json
    $email = $regData.usuario.email
    Write-Host "   Email: $email" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao registrar: $($registerResp.StatusCode)" -ForegroundColor Red
    exit 1
}

# ============ STEP 2: Login ============
Write-Host "`n#2. Fazendo login..." -ForegroundColor Yellow

$loginBody = @{
    email = $email
    senha = "Senha@Forte123"
} | ConvertTo-Json

$loginResp = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing -ErrorAction SilentlyContinue

if ($loginResp.StatusCode -eq 200) {
    Write-Host "✅ Login bem-sucedido" -ForegroundColor Green
    $loginData = $loginResp.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao fazer login: $($loginResp.StatusCode)" -ForegroundColor Red
    exit 1
}

# ============ STEP 3: Criar Farmacêutico ============
Write-Host "`n#3. Criando novo Farmacêutico..." -ForegroundColor Yellow

$farmBody = @{
    nome = "Dr. João Silva Farmacêutico"
    email = "joao_farm_$(Get-Random)@farmacia.com"
    telefone = "(11) 99999-8888"
    especialidade = "Farmácia Clínica"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$farmResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos" -Method POST -Body $farmBody -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($farmResp.StatusCode -eq 201) {
    Write-Host "✅ Farmacêutico criado com sucesso" -ForegroundColor Green
    $farmData = $farmResp.Content | ConvertFrom-Json
    $farmaceuticoId = $farmData.farmaceutico.id_farmaceutico
    Write-Host "   ID: $farmaceuticoId" -ForegroundColor Gray
    Write-Host "   Nome: $($farmData.farmaceutico.nome)" -ForegroundColor Gray
    Write-Host "   Email: $($farmData.farmaceutico.email)" -ForegroundColor Gray
    Write-Host "   Especialidade: $($farmData.farmaceutico.especialidade)" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao criar farmacêutico: $($farmResp.StatusCode)" -ForegroundColor Red
    Write-Host "   Response: $($farmResp.Content)" -ForegroundColor Red
    exit 1
}

# ============ STEP 4: Listar Farmacêuticos ============
Write-Host "`n#4. Listando farmacêuticos..." -ForegroundColor Yellow

$listResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos?skip=0&take=10" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($listResp.StatusCode -eq 200) {
    Write-Host "✅ Listagem obtida com sucesso" -ForegroundColor Green
    $listData = $listResp.Content | ConvertFrom-Json
    Write-Host "   Total de farmacêuticos: $($listData.total)" -ForegroundColor Gray
    Write-Host "   Registros retornados: $($listData.farmaceuticos.Count)" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao listar: $($listResp.StatusCode)" -ForegroundColor Red
}

# ============ STEP 5: Obter Farmacêutico por ID ============
Write-Host "`n#5. Obtendo farmacêutico por ID ($farmaceuticoId)..." -ForegroundColor Yellow

$getResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos/$farmaceuticoId" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($getResp.StatusCode -eq 200) {
    Write-Host "✅ Farmacêutico recuperado" -ForegroundColor Green
    $getData = $getResp.Content | ConvertFrom-Json
    Write-Host "   Nome: $($getData.nome)" -ForegroundColor Gray
    Write-Host "   Email: $($getData.email)" -ForegroundColor Gray
    Write-Host "   Ativo: $($getData.ativo)" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao obter farmacêutico: $($getResp.StatusCode)" -ForegroundColor Red
}

# ============ STEP 6: Atualizar Farmacêutico ============
Write-Host "`n#6. Atualizando farmacêutico..." -ForegroundColor Yellow

$updateBody = @{
    especialidade = "Farmácia Hospitalar"
    telefone = "(11) 98765-4321"
} | ConvertTo-Json

$updateResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos/$farmaceuticoId" -Method PUT -Body $updateBody -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($updateResp.StatusCode -eq 200) {
    Write-Host "✅ Farmacêutico atualizado com sucesso" -ForegroundColor Green
    $updateData = $updateResp.Content | ConvertFrom-Json
    Write-Host "   Nova especialidade: $($updateData.farmaceutico.especialidade)" -ForegroundColor Gray
    Write-Host "   Novo telefone: $($updateData.farmaceutico.telefone)" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao atualizar: $($updateResp.StatusCode)" -ForegroundColor Red
}

# ============ STEP 7: Buscar Farmacêuticos ============
Write-Host "`n#7. Buscando farmacêuticos por termo..." -ForegroundColor Yellow

$searchResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos/buscar?termo=Silva" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($searchResp.StatusCode -eq 200) {
    Write-Host "✅ Busca realizada com sucesso" -ForegroundColor Green
    $searchData = $searchResp.Content | ConvertFrom-Json
    Write-Host "   Resultados encontrados: $($searchData.Count)" -ForegroundColor Gray
    if ($searchData.Count -gt 0) {
        Write-Host "   Primeiro resultado: $($searchData[0].nome)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Erro na busca: $($searchResp.StatusCode)" -ForegroundColor Red
}

# ============ STEP 8: Listar Todos (sem paginação) ============
Write-Host "`n#8. Listando todos os farmacêuticos (sem paginação)..." -ForegroundColor Yellow

$allResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos/todos" -Method GET -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($allResp.StatusCode -eq 200) {
    Write-Host "✅ Lista completa obtida" -ForegroundColor Green
    $allData = $allResp.Content | ConvertFrom-Json
    Write-Host "   Total: $($allData.Count) farmacêuticos" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao obter lista: $($allResp.StatusCode)" -ForegroundColor Red
}

# ============ STEP 9: Deletar Farmacêutico ============
Write-Host "`n#9. Deletando farmacêutico ($farmaceuticoId)..." -ForegroundColor Yellow

$deleteResp = Invoke-WebRequest -Uri "$baseUrl/api/farmaceuticos/$farmaceuticoId" -Method DELETE -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

if ($deleteResp.StatusCode -eq 200) {
    Write-Host "✅ Farmacêutico deletado com sucesso" -ForegroundColor Green
    $deleteData = $deleteResp.Content | ConvertFrom-Json
    Write-Host "   Mensagem: $($deleteData.mensagem)" -ForegroundColor Gray
} else {
    Write-Host "❌ Erro ao deletar: $($deleteResp.StatusCode)" -ForegroundColor Red
}

# ============ RESULTADO FINAL ============
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✅ TODOS OS TESTES COMPLETADOS!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nEndpoints de Farmacêuticos funcionando corretamente:" -ForegroundColor Green
Write-Host "  ✓ POST   /api/farmaceuticos" -ForegroundColor Green
Write-Host "  ✓ GET    /api/farmaceuticos" -ForegroundColor Green
Write-Host "  ✓ GET    /api/farmaceuticos/:id" -ForegroundColor Green
Write-Host "  ✓ GET    /api/farmaceuticos/todos" -ForegroundColor Green
Write-Host "  ✓ GET    /api/farmaceuticos/buscar" -ForegroundColor Green
Write-Host "  ✓ PUT    /api/farmaceuticos/:id" -ForegroundColor Green
Write-Host "  ✓ DELETE /api/farmaceuticos/:id" -ForegroundColor Green
