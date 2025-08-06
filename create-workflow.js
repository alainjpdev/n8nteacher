const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

async function createWorkflow() {
  console.log('🚀 Creating workflow "clase 1"...\n');
  
  try {
    // Workflow template
    const workflowData = {
      name: "clase 1",
      nodes: [
        {
          id: "manual-trigger",
          name: "Manual Trigger",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        }
      ],
      connections: {},
      settings: {
        executionOrder: "v1"
      },
      staticData: null
    };
    
    console.log('📝 Workflow data prepared...');
    console.log(`   Name: ${workflowData.name}`);
    console.log(`   Nodes: ${workflowData.nodes.length}`);
    
    // Create the workflow
    const response = await axios.post(`${N8N_BASE_URL}/workflows`, workflowData, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Workflow created successfully!');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.name}`);
    console.log(`   Status: ${response.data.active ? 'Active' : 'Inactive'}`);
    console.log(`   Created at: ${response.data.createdAt}`);
    
    // Display the workflow in n8n
    console.log(`\n🔗 You can view the workflow at:`);
    console.log(`   http://localhost:5678/workflow/${response.data.id}`);
    
    return response.data;
    
  } catch (error) {
    console.error('\n❌ Error creating workflow:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Status Text: ${error.response.statusText}`);
      if (error.response.data) {
        console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Make sure n8n is running on http://localhost:5678/');
    console.log('   - Check if the API token has write permissions');
    console.log('   - Verify the workflow name is unique');
  }
}

// Run the workflow creation
createWorkflow(); 