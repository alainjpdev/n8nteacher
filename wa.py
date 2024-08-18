from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import openai

# Configura tu API key de OpenAI
openai.api_key = "sk-HKkgPm49_nbqUPXG-Bs-5c1TCdukMn6JAac68-jJUlT3BlbkFJ4oywC12LVxBvfhJf6K1hZ3Ka32tIjVPsL3xZ6eoGYA"

def obtener_respuesta(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100
    )
    return response.choices[0].message['content']

def obtener_xpath(mensaje):
    return input(mensaje)

def encontrar_elemento_con_fallback(driver, xpath, mensaje_error):
    while True:
        try:
            elemento = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
            return elemento
        except:
            print(f"No se pudo encontrar el elemento con el XPath: {xpath}")
            xpath = obtener_xpath(mensaje_error)

# Inicializa el WebDriver
driver = webdriver.Chrome()

# Abre WhatsApp Web
driver.get("https://web.whatsapp.com")
time.sleep(15)  # Espera para escanear el código QR

try:
    # Encuentra el cuadro de búsqueda
    search_box_xpath = '//div[@contenteditable="true"][@data-tab="3"]'
    search_box = encontrar_elemento_con_fallback(driver, search_box_xpath, "Ingresa el nuevo XPath para la barra de búsqueda: ")

    search_box.send_keys("Angelo")
    search_box.send_keys(Keys.RETURN)

    time.sleep(5)  # Espera un poco para que se cargue el chat

    # Encuentra el cuadro de texto del mensaje
    message_box_xpath = '//div[@contenteditable="true"][@data-tab="10"]'
    message_box = encontrar_elemento_con_fallback(driver, message_box_xpath, "Ingresa el nuevo XPath para el cuadro de mensaje: ")

    # Encuentra el último mensaje recibido
    last_message_xpath = '(//div[contains(@class, "message-in")])[last()]//span[@class="selectable-text copyable-text"]'
    last_message = encontrar_elemento_con_fallback(driver, last_message_xpath, "Ingresa el nuevo XPath para el último mensaje: ").text

    # Obtiene una respuesta de OpenAI
    respuesta = obtener_respuesta(last_message)

    # Envía la respuesta al chat
    message_box.send_keys(respuesta)
    message_box.send_keys(Keys.RETURN)

finally:
    # El navegador no se cierra automáticamente
    print("El script ha terminado de enviar mensajes.")