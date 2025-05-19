import requests
import schedule
import time
from datetime import datetime

# API URL (AwesomeAPI é uma boa opção, gratuita e não requer chave para cotações simples)
# Consulta Dólar Americano para Real Brasileiro (USD-BRL) e Euro para Real Brasileiro (EUR-BRL)
API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"

def buscar_cotacoes():
    """Busca as cotações do Dólar e Euro e as imprime."""
    try:
        print(f"--- {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---")
        print("Buscando cotações...")

        response = requests.get(API_URL)
        response.raise_for_status()  # Levanta um erro para respostas HTTP ruins (4xx ou 5xx)

        data = response.json()

        # Extraindo as cotações
        # A API retorna um dicionário onde as chaves são 'USDBRL' e 'EURBRL'
        cotacao_dolar_info = data.get('USDBRL')
        cotacao_euro_info = data.get('EURBRL')

        if cotacao_dolar_info:
            valor_dolar = float(cotacao_dolar_info['bid']) # 'bid' é o preço de compra
            print(f"Dólar (USD-BRL): R$ {valor_dolar:.2f}")
        else:
            print("Não foi possível obter a cotação do Dólar.")

        if cotacao_euro_info:
            valor_euro = float(cotacao_euro_info['bid']) # 'bid' é o preço de compra
            print(f"Euro (EUR-BRL):  R$ {valor_euro:.2f}")
        else:
            print("Não foi possível obter a cotação do Euro.")

        print("-" * 30)

    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar à API: {e}")
    except KeyError as e:
        print(f"Erro ao processar os dados da API (chave não encontrada: {e}). A estrutura da API pode ter mudado.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

if __name__ == "__main__":
    print("Iniciando monitoramento de cotações...")

    # Executa a função uma vez imediatamente ao iniciar
    buscar_cotacoes()

    # Agenda a função para ser executada a cada hora, no minuto :00
    # Ex: 10:00, 11:00, 12:00
    schedule.every().hour.at(":00").do(buscar_cotacoes)
    # Se preferir que execute a cada hora a partir do momento que o script rodou:
    # schedule.every(1).hours.do(buscar_cotacoes)

    print("Agendado para buscar cotações a cada hora.")
    print("Pressione Ctrl+C para sair.")

    try:
        while True:
            schedule.run_pending()
            time.sleep(1)  # Verifica a cada segundo se há tarefas agendadas para rodar
    except KeyboardInterrupt:
        print("\nMonitoramento de cotações encerrado pelo usuário.")
    except Exception as e:
        print(f"Erro fatal no loop principal: {e}")