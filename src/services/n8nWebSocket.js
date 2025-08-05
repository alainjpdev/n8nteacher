class N8nWebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.isMonitoring = false;
    this.logCallback = null;
    this.statusCallback = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.connectionStatus = 'disconnected'; // 'disconnected', 'connecting', 'connected', 'error'
    this.connectionTimeout = null;
  }

  // Set log callback function
  setLogCallback(callback) {
    this.logCallback = callback;
  }

  // Set status callback function
  setStatusCallback(callback) {
    this.statusCallback = callback;
  }

  // Emit log message
  emitLog(type, message, details = null) {
    const logEntry = {
      type,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    if (this.logCallback) {
      this.logCallback(logEntry);
    }
    
    console.log(`n8n WebSocket [${type.toUpperCase()}]:`, message, details);
  }

  // Update connection status
  updateConnectionStatus(status) {
    this.connectionStatus = status;
    if (this.statusCallback) {
      this.statusCallback({
        isConnected: this.isConnected,
        isMonitoring: this.isMonitoring,
        connectionStatus: this.connectionStatus
      });
    }
  }

  // Connect to WebSocket server
  connect() {
    try {
      this.updateConnectionStatus('connecting');
      this.emitLog('info', 'Conectando al servidor de monitoreo...');
      
      // Clear any existing connection
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      // Clear timeout
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      
      this.ws = new WebSocket('ws://localhost:3001');
      
      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          this.emitLog('error', 'Timeout de conexión WebSocket');
          this.ws.close();
        }
      }, 10000); // 10 second timeout
      
      this.ws.onopen = () => {
        clearTimeout(this.connectionTimeout);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus('connected');
        this.emitLog('success', 'Conectado al servidor de monitoreo');
        
        // Request current status
        this.sendMessage({ action: 'get_status' });
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'log':
              if (this.logCallback) {
                this.logCallback(data.data);
              }
              break;
            case 'status':
              this.isMonitoring = data.data.isMonitoring;
              if (this.statusCallback) {
                this.statusCallback({
                  ...data.data,
                  connectionStatus: this.connectionStatus
                });
              }
              break;
            default:
              console.log('Mensaje WebSocket recibido:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.emitLog('error', 'Error al procesar mensaje WebSocket', error.message);
        }
      };
      
      this.ws.onclose = (event) => {
        clearTimeout(this.connectionTimeout);
        this.isConnected = false;
        this.updateConnectionStatus('disconnected');
        
        const closeInfo = {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        };
        
        this.emitLog('warning', 'Conexión WebSocket cerrada', closeInfo);
        
        // Log specific close codes
        switch (event.code) {
          case 1000:
            this.emitLog('info', 'Conexión cerrada normalmente');
            break;
          case 1001:
            this.emitLog('info', 'Servidor se está apagando');
            break;
          case 1002:
            this.emitLog('error', 'Error de protocolo');
            break;
          case 1003:
            this.emitLog('error', 'Tipo de dato no soportado');
            break;
          case 1006:
            this.emitLog('error', 'Conexión cerrada anormalmente (sin close frame)');
            break;
          case 1011:
            this.emitLog('error', 'Error interno del servidor');
            break;
          default:
            this.emitLog('warning', `Código de cierre desconocido: ${event.code}`);
        }
        
        // Attempt to reconnect only if not a clean close
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.emitLog('info', `Reintentando conexión... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.updateConnectionStatus('error');
          this.emitLog('error', 'No se pudo reconectar al servidor de monitoreo');
        }
      };
      
      this.ws.onerror = (error) => {
        this.updateConnectionStatus('error');
        this.emitLog('error', 'Error en la conexión WebSocket', {
          message: error.message,
          type: error.type,
          target: error.target ? error.target.readyState : 'unknown'
        });
      };
      
    } catch (error) {
      this.updateConnectionStatus('error');
      this.emitLog('error', 'Error al conectar WebSocket', error.message);
    }
  }

  // Send message to WebSocket server
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log('Mensaje enviado al WebSocket:', message);
      } catch (error) {
        this.emitLog('error', 'Error enviando mensaje WebSocket', error.message);
      }
    } else {
      const state = this.ws ? this.ws.readyState : 'null';
      this.emitLog('warning', 'WebSocket no está conectado. Estado:', {
        readyState: state,
        stateName: this.getStateName(state)
      });
    }
  }

  // Get WebSocket state name
  getStateName(state) {
    switch (state) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }

  // Start monitoring
  startMonitoring() {
    this.emitLog('info', 'Solicitando inicio de monitoreo...');
    this.sendMessage({ action: 'start_monitoring' });
  }

  // Stop monitoring
  stopMonitoring() {
    this.emitLog('info', 'Solicitando parada de monitoreo...');
    this.sendMessage({ action: 'stop_monitoring' });
  }

  // Disconnect
  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.isMonitoring = false;
    this.updateConnectionStatus('disconnected');
    this.emitLog('info', 'Desconectado del servidor de monitoreo');
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isMonitoring: this.isMonitoring,
      connectionStatus: this.connectionStatus
    };
  }

  // Force reconnect
  reconnect() {
    this.emitLog('info', 'Forzando reconexión...');
    this.reconnectAttempts = 0;
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 1000);
  }
}

export default new N8nWebSocketService(); 