const axios = require('axios');
const fs = require('fs');
const path = require('path');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

// Workflow ID from the previous creation
const WORKFLOW_ID = 'FVKBIatFo5HXrLs7';

async function updateWorkflowWithAgente() {
  console.log('🔄 Updating workflow with "Agente para Principiantes"...\n');
  
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
    console.log(`   Workflow name: ${workflowData.name}`);
    console.log(`   Nodes count: ${workflowData.nodes.length}`);
    console.log(`   Workflow ID: ${workflowData.id}`);
    
    // Prepare the update data
    const updateData = {
      name: workflowData.name,
      nodes: workflowData.nodes,
      connections: workflowData.connections,
      settings: workflowData.settings,
      staticData: workflowData.staticData || null
    };
    
    console.log('\n📝 Preparing update data...');
    console.log(`   Nodes to update: ${updateData.nodes.length}`);
    console.log(`   Connections: ${Object.keys(updateData.connections).length}`);
    
    // Show the nodes that will be added
    console.log('\n📋 Nodes in the workflow:');
    updateData.nodes.forEach((node, index) => {
      console.log(`   ${index + 1}. ${node.name} (${node.type})`);
    });
    
    // Update the workflow
    const response = await axios.put(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, updateData, {
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
    
    // Display the updated workflow
    console.log(`\n🔗 You can view the updated workflow at:`);
    console.log(`   http://localhost:5678/workflow/${response.data.id}`);
    
    // Show workflow details
    console.log('\n📊 Workflow Details:');
    console.log(`   - Form Trigger: On form submission`);
    console.log(`   - AI Agent: Processes user responses`);
    console.log(`   - Email: Sends personalized responses`);
    console.log(`   - Model: OpenRouter Chat Model (GPT-4.1)`);
    
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
    console.log('   - Check if all required credentials are configured');
  }
}

// Run the workflow update
updateWorkflowWithAgente(); 