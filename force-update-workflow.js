const axios = require('axios');
const fs = require('fs');
const path = require('path');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

// Workflow ID
const WORKFLOW_ID = 'FVKBIatFo5HXrLs7';

async function forceUpdateWorkflow() {
  console.log('🔄 Force updating workflow with "Agente para Principiantes"...\n');
  
  try {
    // Read the JSON file
    const jsonFilePath = path.join(__dirname, 'json-files', 'Agente_para_Principiantes.json');
    console.log(`📖 Reading JSON file: ${jsonFilePath}`);
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON file not found: ${jsonFilePath}`);
    }
    
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const workflowData = JSON.parse(jsonContent);
    
    console.log('✅ JSON file loaded successfully');
    console.log(`   Original name: ${workflowData.name}`);
    console.log(`   Nodes count: ${workflowData.nodes.length}`);
    
    // Create a completely new workflow data structure
    const newWorkflowData = {
      name: "Agente para Principiantes",
      nodes: workflowData.nodes,
      connections: workflowData.connections,
      settings: {
        executionOrder: "v1"
      },
      staticData: null
    };
    
    console.log('\n📝 Preparing new workflow data...');
    console.log(`   New name: ${newWorkflowData.name}`);
    console.log(`   Nodes: ${newWorkflowData.nodes.length}`);
    console.log(`   Connections: ${Object.keys(newWorkflowData.connections).length}`);
    
    // Show the nodes that will be in the new workflow
    console.log('\n📋 Nodes in the new workflow:');
    newWorkflowData.nodes.forEach((node, index) => {
      console.log(`   ${index + 1}. ${node.name} (${node.type})`);
    });
    
    // First, let's check the current workflow
    console.log('\n🔍 Checking current workflow...');
    const currentResponse = await axios.get(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Current name: ${currentResponse.data.name}`);
    console.log(`   Current nodes: ${currentResponse.data.nodes.length}`);
    
    // Now update the workflow
    console.log('\n🔄 Updating workflow...');
    const response = await axios.put(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, newWorkflowData, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('\n✅ Workflow updated successfully!');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.name}`);
    console.log(`   Status: ${response.data.active ? 'Active' : 'Inactive'}`);
    console.log(`   Updated at: ${response.data.updatedAt}`);
    console.log(`   Final nodes count: ${response.data.nodes.length}`);
    
    // Display the updated workflow
    console.log(`\n🔗 You can view the updated workflow at:`);
    console.log(`   http://localhost:5678/workflow/${response.data.id}`);
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const verifyResponse = await axios.get(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Verified name: ${verifyResponse.data.name}`);
    console.log(`   Verified nodes: ${verifyResponse.data.nodes.length}`);
    
    return response.data;
    
  } catch (error) {
    console.error('\n❌ Error updating workflow:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Status Text: ${error.response.statusText}`);
      if (error.response.data) {
        console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Make sure n8n is running on http://localhost:5678/');
    console.log('   - Check if the workflow ID is correct');
    console.log('   - Verify the JSON file exists and is valid');
  }
}

// Run the force update
forceUpdateWorkflow(); 