import React, { useState, useEffect } from 'react';
import n8nMCPService from '../services/n8nMCP';

const N8nMCPIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [error, setError] = useState('');

  // Initialize n8n MCP connection
  useEffect(() => {
    const initializeN8n = async () => {
      setIsLoading(true);
      try {
        const isInitialized = await n8nMCPService.initialize();
        if (isInitialized) {
          setIsConnected(true);
          await loadWorkflows();
        }
      } catch (err) {
        setError('Failed to initialize n8n MCP connection');
        console.error('n8n MCP Init Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeN8n();
  }, []);

  // Load workflows from n8n
  const loadWorkflows = async () => {
    try {
      const workflowsData = await n8nMCPService.getWorkflows();
      setWorkflows(workflowsData.data || []);
    } catch (err) {
      setError('Failed to load workflows');
      console.error('n8n MCP Load Workflows Error:', err);
    }
  };

  // Create a new workflow based on exercise
  const createWorkflowFromExercise = async (exerciseData) => {
    setIsLoading(true);
    setError('');

    try {
      const workflowData = {
        name: exerciseData.title,
        nodes: generateNodesFromExercise(exerciseData),
        connections: generateConnectionsFromExercise(exerciseData),
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true
        },
        tags: ['exercise', 'automation']
      };

      const newWorkflow = await n8nMCPService.createWorkflow(workflowData);
      setCurrentWorkflow(newWorkflow);
      
      // Reload workflows list
      await loadWorkflows();
      
      console.log('n8n MCP: Workflow created from exercise:', newWorkflow);
      return newWorkflow;
    } catch (err) {
      setError('Failed to create workflow from exercise');
      console.error('n8n MCP Create Workflow Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate nodes based on exercise type
  const generateNodesFromExercise = (exerciseData) => {
    const nodes = [];
    let nodeId = 1;

    // Add trigger node based on exercise
    if (exerciseData.type === 'webhook') {
      nodes.push({
        id: `node_${nodeId++}`,
        name: 'Webhook Trigger',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [0, 0],
        parameters: {
          httpMethod: 'POST',
          path: '/webhook',
          responseMode: 'responseNode'
        }
      });
    }

    // Add processing nodes
    if (exerciseData.content.includes('Set')) {
      nodes.push({
        id: `node_${nodeId++}`,
        name: 'Set Data',
        type: 'n8n-nodes-base.set',
        typeVersion: 1,
        position: [300, 0],
        parameters: {
          values: {
            string: [
              {
                name: 'email',
                value: '={{ $json.email }}'
              },
              {
                name: 'nombre',
                value: '={{ $json.nombre }}'
              }
            ]
          }
        }
      });
    }

    // Add validation node
    if (exerciseData.content.includes('IF')) {
      nodes.push({
        id: `node_${nodeId++}`,
        name: 'Validate Email',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [600, 0],
        parameters: {
          conditions: {
            string: [
              {
                value1: '={{ $json.email }}',
                operation: 'contains',
                value2: '@'
              }
            ]
          }
        }
      });
    }

    // Add database node
    if (exerciseData.content.includes('Base de Datos')) {
      nodes.push({
        id: `node_${nodeId++}`,
        name: 'PostgreSQL',
        type: 'n8n-nodes-base.postgres',
        typeVersion: 1,
        position: [900, 0],
        parameters: {
          operation: 'insert',
          table: 'users',
          columns: 'email,nombre,created_at',
          values: '={{ $json.email }},={{ $json.nombre }},={{ $now }}'
        }
      });
    }

    // Add email node
    if (exerciseData.content.includes('Notificación')) {
      nodes.push({
        id: `node_${nodeId++}`,
        name: 'Send Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 1,
        position: [1200, 0],
        parameters: {
          toEmail: '={{ $json.email }}',
          subject: 'Datos procesados correctamente',
          text: 'Hola {{ $json.nombre }}, tus datos han sido procesados y guardados exitosamente.'
        }
      });
    }

    return nodes;
  };

  // Generate connections between nodes
  const generateConnectionsFromExercise = (exerciseData) => {
    const connections = {};
    const nodeCount = exerciseData.content.includes('Set') ? 1 : 0;
    const nodeCount2 = exerciseData.content.includes('IF') ? 1 : 0;
    const nodeCount3 = exerciseData.content.includes('Base de Datos') ? 1 : 0;
    const nodeCount4 = exerciseData.content.includes('Notificación') ? 1 : 0;

    let connectionId = 1;

    // Connect webhook to first processing node
    if (nodeCount > 0) {
      connections[`connection_${connectionId++}`] = {
        source: 'node_1',
        sourceOutput: 0,
        target: 'node_2',
        targetInput: 0
      };
    }

    // Connect processing nodes
    if (nodeCount > 0 && nodeCount2 > 0) {
      connections[`connection_${connectionId++}`] = {
        source: 'node_2',
        sourceOutput: 0,
        target: 'node_3',
        targetInput: 0
      };
    }

    if (nodeCount2 > 0 && nodeCount3 > 0) {
      connections[`connection_${connectionId++}`] = {
        source: 'node_3',
        sourceOutput: 0,
        target: 'node_4',
        targetInput: 0
      };
    }

    if (nodeCount3 > 0 && nodeCount4 > 0) {
      connections[`connection_${connectionId++}`] = {
        source: 'node_4',
        sourceOutput: 0,
        target: 'node_5',
        targetInput: 0
      };
    }

    return connections;
  };

  // Execute a workflow
  const executeWorkflow = async (workflowId, inputData = {}) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await n8nMCPService.executeWorkflow(workflowId, inputData);
      console.log('n8n MCP: Workflow executed:', result);
      
      // Load execution history
      const history = await n8nMCPService.getExecutionHistory(workflowId);
      setExecutionHistory(history.data || []);
      
      return result;
    } catch (err) {
      setError('Failed to execute workflow');
      console.error('n8n MCP Execute Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Test webhook with sample data
  const testWebhook = async (workflowId) => {
    const testData = {
      email: 'test@example.com',
      nombre: 'Usuario de Prueba',
      timestamp: new Date().toISOString()
    };

    try {
      const result = await executeWorkflow(workflowId, testData);
      console.log('n8n MCP: Webhook test successful:', result);
      return result;
    } catch (err) {
      console.error('n8n MCP: Webhook test failed:', err);
      throw err;
    }
  };

  return {
    isConnected,
    isLoading,
    workflows,
    currentWorkflow,
    executionHistory,
    error,
    createWorkflowFromExercise,
    executeWorkflow,
    testWebhook,
    loadWorkflows
  };
};

export default N8nMCPIntegration; 