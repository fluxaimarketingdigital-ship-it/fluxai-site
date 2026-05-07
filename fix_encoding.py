import sys
import os

replacements = {
    'coraÃÂ§ÃÂ£o': 'coração',
    'atenÃÂ§ÃÂ£o': 'atenção',
    'GestÃÂ£o': 'Gestão',
    'EstratÃÂ©gica': 'Estratégica',
    'divisÃÂ£o': 'divisão',
    'InteligÃÂªncia': 'Inteligência',
    'AutomaÃÂ§ÃÂ£o': 'Automação',
    'SecretÃÂ¡rias': 'Secretárias',
    'conversaÃÂ§ÃÂ£o': 'conversação',
    'SoluÃÂ§ÃÂµes': 'Soluções',
    'estratÃ©gia': 'estratégia',
    'OrganizaÃÂ§ÃÂ£o': 'Organização',
    'TrÃÂ¡fego': 'Tráfego',
    'ServiÃÂ§os': 'Serviços',
    'JoÃÂ£o': 'João',
    'inteligÃÂªncia': 'inteligência',
    'gestÃÂ£o': 'gestão',
    'diagnÃÂ³stico': 'diagnóstico',
    'estratÃÂ©gico': 'estratégico',
    'CapacitaÃÂ§ÃÂ£o': 'Capacitação',
    'RetenÃÂ§ÃÂ£o': 'Retenção',
    'ExpansÃÂ£o': 'Expansão',
    'ConfiguraÃÂ§ÃÂ£o': 'Configuração',
    'AnÃÂ¡lise': 'Análise',
    'conversÃÂ§ÃÂ£o': 'conversação',
    'PadrÃÂ£o': 'Padrão',
    'diagnÃ³stico': 'diagnóstico',
    'SoluÃ§Ãµes': 'Soluções',
    'nÃ³s': 'nós',
    'não': 'não',
    'Não': 'Não',
    'é': 'é',
    'É': 'É',
    'â—': '●',
    'â— ': '● ',
    'Ã—': '×'
}

file_path = r'c:\Users\BRENDA\Desktop\Identidade Visual FluxAI\Fluxai-site\index.html'

try:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Also handle some single-byte UTF-8 misinterpretations
    content = content.replace('Ã©', 'é')
    content = content.replace('Ã¡', 'á')
    content = content.replace('Ã³', 'ó')
    content = content.replace('Ãª', 'ê')
    content = content.replace('Ã§Ã£', 'ção')
    content = content.replace('Ãµ', 'õ')
    content = content.replace('Ãº', 'ú')
    content = content.replace('Ã­', 'í')
    content = content.replace('Ã£', 'ã')
    content = content.replace('Ã', 'à') # Dangerous, but often true for Ã alone
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Correção concluída com sucesso.")
except Exception as e:
    print(f"Erro: {e}")
