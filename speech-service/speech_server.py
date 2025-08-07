#!/usr/bin/env python3
"""
Servidor de Google Speech-to-Text para la aplicación n8n Teacher
Permite escuchar comandos de voz del usuario y enviarlos al frontend
"""

import os
import json
import asyncio
import websockets
from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from google.cloud import speech
from google.cloud import texttospeech
import threading
import queue
import time

# Configuración
SPEECH_PORT = 3002
WEBSOCKET_PORT = 3003

app = Flask(__name__)
CORS(app)

# Configurar Google Cloud (necesitarás un archivo de credenciales)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/your/credentials.json'

class SpeechService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.is_listening = False
        self.audio_queue = queue.Queue()
        self.websocket_clients = set()
        
        # Configurar el micrófono
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
    
    def start_listening(self):
        """Iniciar escucha continua"""
        self.is_listening = True
        threading.Thread(target=self._listen_loop, daemon=True).start()
        return {"status": "success", "message": "Escucha iniciada"}
    
    def stop_listening(self):
        """Detener escucha"""
        self.is_listening = False
        return {"status": "success", "message": "Escucha detenida"}
    
    def _listen_loop(self):
        """Loop principal de escucha"""
        while self.is_listening:
            try:
                with self.microphone as source:
                    print("🎤 Escuchando...")
                    audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=10)
                    
                    # Procesar audio con Google Speech-to-Text
                    text = self._process_audio(audio)
                    
                    if text:
                        print(f"🗣️ Usuario dijo: {text}")
                        self._broadcast_speech(text)
                        
            except sr.WaitTimeoutError:
                continue
            except Exception as e:
                print(f"❌ Error en escucha: {e}")
                continue
    
    def _process_audio(self, audio):
        """Procesar audio con Google Speech-to-Text"""
        try:
            # Usar Google Speech-to-Text
            client = speech.SpeechClient()
            
            # Convertir audio a formato requerido
            audio_data = audio.get_wav_data()
            
            # Configurar reconocimiento
            audio = speech.RecognitionAudio(content=audio_data)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="es-ES",
                enable_automatic_punctuation=True,
                enable_word_time_offsets=True
            )
            
            # Realizar reconocimiento
            response = client.recognize(config=config, audio=audio)
            
            if response.results:
                return response.results[0].alternatives[0].transcript
            
        except Exception as e:
            print(f"❌ Error procesando audio: {e}")
            return None
    
    def _broadcast_speech(self, text):
        """Enviar texto reconocido a todos los clientes WebSocket"""
        message = {
            "type": "speech_recognized",
            "text": text,
            "timestamp": time.time()
        }
        
        # Enviar a todos los clientes conectados
        for client in self.websocket_clients.copy():
            try:
                asyncio.run(self._send_to_client(client, message))
            except Exception as e:
                print(f"❌ Error enviando a cliente: {e}")
                self.websocket_clients.discard(client)
    
    async def _send_to_client(self, websocket, message):
        """Enviar mensaje a un cliente específico"""
        await websocket.send(json.dumps(message))
    
    async def register_client(self, websocket):
        """Registrar nuevo cliente WebSocket"""
        self.websocket_clients.add(websocket)
        print(f"✅ Cliente WebSocket registrado. Total: {len(self.websocket_clients)}")
    
    async def unregister_client(self, websocket):
        """Desregistrar cliente WebSocket"""
        self.websocket_clients.discard(websocket)
        print(f"❌ Cliente WebSocket desconectado. Total: {len(self.websocket_clients)}")

# Instancia global del servicio
speech_service = SpeechService()

# Rutas de la API REST
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "speech-to-text"})

@app.route('/api/speech/start', methods=['POST'])
def start_listening():
    """Iniciar escucha de voz"""
    return jsonify(speech_service.start_listening())

@app.route('/api/speech/stop', methods=['POST'])
def stop_listening():
    """Detener escucha de voz"""
    return jsonify(speech_service.stop_listening())

@app.route('/api/speech/status', methods=['GET'])
def get_status():
    """Obtener estado del servicio"""
    return jsonify({
        "is_listening": speech_service.is_listening,
        "clients_connected": len(speech_service.websocket_clients)
    })

# Servidor WebSocket
async def websocket_handler(websocket, path):
    """Manejar conexiones WebSocket"""
    await speech_service.register_client(websocket)
    
    try:
        async for message in websocket:
            # Procesar mensajes del cliente si es necesario
            data = json.loads(message)
            print(f"📨 Mensaje recibido: {data}")
            
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await speech_service.unregister_client(websocket)

def start_websocket_server():
    """Iniciar servidor WebSocket"""
    start_server = websockets.serve(websocket_handler, "localhost", WEBSOCKET_PORT)
    print(f"🔗 Servidor WebSocket iniciado en ws://localhost:{WEBSOCKET_PORT}")
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    print("🎤 Iniciando servidor de Speech-to-Text...")
    
    # Iniciar servidor WebSocket en un hilo separado
    websocket_thread = threading.Thread(target=start_websocket_server, daemon=True)
    websocket_thread.start()
    
    # Iniciar servidor Flask
    print(f"🔗 Servidor REST iniciado en http://localhost:{SPEECH_PORT}")
    app.run(host='0.0.0.0', port=SPEECH_PORT, debug=False)
