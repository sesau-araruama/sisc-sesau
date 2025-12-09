import os
import sys
from datetime import datetime

# Lista dos arquivos CRÍTICOS para verificar (caminhos relativos à raiz do projeto)
ARQUIVOS_PARA_VERIFICAR = [
    # Configurações do projeto
    "package.json",
    "tsconfig.json",
    "vercel.json",
    "prisma/schema.prisma",
    
    # Autenticação e Middleware
    "middleware.ts",
    "app/lib/auth.ts",
    "app/lib/prisma.ts",
    
    # Componentes e Páginas
    "app/components/ForcePasswordChange.tsx",
    "app/force-password-change/page.tsx",
    "app/admin/usuarios/page.tsx",
    
    # APIs
    "app/api/auth/login/route.ts",
    "app/api/auth/change-password/route.ts",
    
    # Páginas principais
    "app/login/page.tsx",
    "app/dashboard/page.tsx",
    "app/page.tsx",
]

def criar_relatorio_arquivos():
    """
    Cria um relatório unificado com o conteúdo de todos os arquivos importantes
    """
    relatorio = []
    relatorio.append("=" * 80)
    relatorio.append("RELATORIO DE VERIFICACAO - SISC-SESAU")
    relatorio.append("=" * 80)
    relatorio.append(f"Data da verificacao: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    relatorio.append("")
    
    total_arquivos = len(ARQUIVOS_PARA_VERIFICAR)
    encontrados = 0
    faltantes = 0
    
    for caminho_arquivo in ARQUIVOS_PARA_VERIFICAR:
        relatorio.append("-" * 80)
        
        if os.path.exists(caminho_arquivo):
            encontrados += 1
            relatorio.append(f"[OK] ARQUIVO ENCONTRADO: {caminho_arquivo}")
            relatorio.append(f"   Tamanho: {os.path.getsize(caminho_arquivo)} bytes")
            
            try:
                with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    
                # Adiciona uma amostra do conteúdo (primeiras 15 linhas)
                linhas = conteudo.split('\n')
                relatorio.append(f"   Amostra ({min(15, len(linhas))} primeiras linhas):")
                relatorio.append("   " + "-" * 40)
                
                for i, linha in enumerate(linhas[:15]):
                    # Remove caracteres de controle que podem causar problemas
                    linha_limpa = linha.replace('\r', '').replace('\t', '    ')
                    if len(linha_limpa) > 100:
                        linha_limpa = linha_limpa[:100] + "..."
                    relatorio.append(f"   {i+1:3d}: {linha_limpa}")
                
                if len(linhas) > 15:
                    relatorio.append(f"   ... ({len(linhas) - 15} linhas omitidas)")
                    
                # Informações específicas por tipo de arquivo
                if caminho_arquivo == "package.json":
                    if '"prisma":' in conteudo and '"dependencies"' in conteudo:
                        relatorio.append("   [INFO] Prisma esta em dependencies (CORRETO)")
                    elif '"prisma":' in conteudo:
                        relatorio.append("   [ATENCAO] Prisma pode estar em devDependencies (VERIFICAR)")
                
                elif caminho_arquivo == "tsconfig.json":
                    if '"@/*": ["./*"]' in conteudo:
                        relatorio.append("   [INFO] Configuracao de paths esta correta")
                
            except UnicodeDecodeError:
                # Se não for texto UTF-8, mostra informação binária
                relatorio.append("   [INFO] Arquivo binario ou codificacao diferente")
            except Exception as e:
                relatorio.append(f"   [ERRO] Erro ao ler arquivo: {str(e)[:100]}")
                
        else:
            faltantes += 1
            relatorio.append(f"[FALTANDO] ARQUIVO FALTANTE: {caminho_arquivo}")
            relatorio.append(f"   Localizacao esperada: {os.path.abspath(caminho_arquivo)}")
            
            # Sugestões para arquivos críticos faltantes
            if caminho_arquivo == "app/lib/prisma.ts":
                relatorio.append("   [IMPORTANTE] Este arquivo e ESSENCIAL para a conexao com o banco!")
        
        relatorio.append("")  # Linha em branco entre arquivos
    
    # Resumo
    relatorio.append("=" * 80)
    relatorio.append("RESUMO:")
    relatorio.append(f"Total de arquivos verificados: {total_arquivos}")
    relatorio.append(f"[OK] Encontrados: {encontrados}")
    relatorio.append(f"[FALTANDO] Faltantes: {faltantes}")
    if total_arquivos > 0:
        relatorio.append(f"Taxa de completude: {(encontrados/total_arquivos)*100:.1f}%")
    relatorio.append("")
    
    if faltantes == 0:
        relatorio.append("[SUCESSO] TODOS os arquivos essenciais estao presentes!")
        relatorio.append("   Voce pode prosseguir com o deploy no Vercel.")
    else:
        relatorio.append("[ATENCAO] ALGUNS ARQUIVOS ESTAO FALTANDO!")
        relatorio.append("   Revise a lista acima antes de prosseguir.")
    
    relatorio.append("=" * 80)
    
    # Salva o relatório em um arquivo
    nome_relatorio = "sisc_sesau_verificacao.txt"
    try:
        with open(nome_relatorio, 'w', encoding='utf-8') as f:
            f.write('\n'.join(relatorio))
        
        # Mostra apenas o resumo no terminal
        print('\n'.join(relatorio[-15:]))
        print(f"\nRelatorio completo salvo em: {os.path.abspath(nome_relatorio)}")
        
        return nome_relatorio, faltantes
    except Exception as e:
        print(f"[ERRO] Nao foi possivel salvar o relatorio: {e}")
        return None, faltantes

def verificar_estrutura_pastas():
    """
    Verifica a estrutura básica de pastas do projeto
    """
    print("\n" + "=" * 60)
    print("VERIFICACAO DE ESTRUTURA DE PASTAS")
    print("=" * 60)
    
    pastas_essenciais = [
        "app",
        "app/lib",
        "app/components",
        "app/api",
        "app/api/auth",
        "app/login",
        "app/dashboard",
        "app/admin",
        "app/admin/usuarios",
        "prisma"
    ]
    
    for pasta in pastas_essenciais:
        if os.path.exists(pasta):
            print(f"[OK] {pasta}/")
        else:
            print(f"[FALTANDO] {pasta}/")

def main():
    """
    Função principal do script
    """
    print("Iniciando verificacao do projeto SISC-SESAU...")
    print()
    
    try:
        # Verifica estrutura de pastas
        verificar_estrutura_pastas()
        
        # Cria relatório detalhado
        print("\n" + "=" * 60)
        print("ANALISANDO CONTEUDO DOS ARQUIVOS...")
        print("=" * 60)
        
        relatorio, faltantes = criar_relatorio_arquivos()
        
        if relatorio:
            print("\n" + "=" * 60)
            if faltantes == 0:
                print("VERIFICACAO CONCLUIDA - PRONTO PARA DEPLOY!")
            else:
                print("VERIFICACAO CONCLUIDA - CORRIJA OS ARQUIVOS FALTANTES!")
            print("=" * 60)
        else:
            print("[ERRO] Nao foi possivel gerar o relatorio completo.")
            
    except KeyboardInterrupt:
        print("\n[INFO] Verificacao interrompida pelo usuario.")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERRO] Ocorreu um erro inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
