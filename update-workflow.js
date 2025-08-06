const axios = require('axios');
const fs = require('fs');
const path = require('path');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

// Workflow ID from the previous creation
const WORKFLOW_ID = 'FVKBIatFo5HXrLs7';

async function updateWorkflow() {
  console.log('🔄 Updating workflow "clase 1"...\n');
  
  try {
    // Read the JSON file
    const jsonFilePath = path.join(__dirname, 'json-files', 'clase1-data.json');
    console.log(`📖 Reading JSON file: ${jsonFilePath}`);
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON file not found: ${jsonFilePath}`);
    }
    
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const workflowData = JSON.parse(jsonContent);
    
    console.log('✅ JSON file loaded successfully');
    console.log(`   Workflow name: ${workflowData.workflow.name}`);
    console.log(`   Nodes count: ${workflowData.workflow.nodes.length}`);
    console.log(`   Description: ${workflowData.workflow.description}`);
    
    // Prepare the update data (only the workflow part, not metadata)
    const updateData = {
      name: workflowData.workflow.name,
      nodes: workflowData.workflow.nodes,
      connections: workflowData.workflow.connections,
      settings: workflowData.workflow.settings,
      staticData: workflowData.workflow.staticData
    };
    
    console.log('\n📝 Preparing update data...');
    console.log(`   Nodes to update: ${updateData.nodes.length}`);
    console.log(`   Connections: ${Object.keys(updateData.connections).length}`);
    
    // Update the workflow
    const response = await axios.put(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, updateData, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Workflow updated successfully!');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.name}`);
    console.log(`   Status: ${response.data.active ? 'Active' : 'Inactive'}`);
    console.log(`   Updated at: ${response.data.updatedAt}`);
    
    // Display the updated workflow
    console.log(`\n🔗 You can view the updated workflow at:`);
    console.log(`   http://localhost:5678/workflow/${response.data.id}`);
    
    // Show the nodes that were added
    console.log('\n📋 Nodes in the updated workflow:');
    response.data.nodes.forEach((node, index) => {
      console.log(`   ${index + 1}. ${node.name} (${node.type})`);
    });
    
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

// Run the workflow update
updateWorkflow(); 