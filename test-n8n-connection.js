const axios = require('axios');

// n8n Configuration (same as server)
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

async function testN8nConnection() {
  console.log('🧪 Testing n8n API Connection...\n');
  
  try {
    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity...');
    const healthResponse = await axios.get('http://localhost:5678/', {
      timeout: 5000
    });
    console.log('✅ n8n is accessible at http://localhost:5678/');
    console.log(`   Status: ${healthResponse.status}`);
    
    // Test 2: API authentication
    console.log('\n2. Testing API authentication...');
    const workflowsResponse = await axios.get(`${N8N_BASE_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ API authentication successful');
    console.log(`   Status: ${workflowsResponse.status}`);
    
    const workflows = workflowsResponse.data.data || workflowsResponse.data;
    const workflowsArray = Array.isArray(workflows) ? workflows : [];
    console.log(`   Workflows found: ${workflowsArray.length}`);
    
    // Display workflows
    if (workflowsArray.length > 0) {
      console.log('\n   Available workflows:');
      workflowsArray.forEach((workflow, index) => {
        console.log(`   ${index + 1}. ${workflow.name || 'Unnamed'} (ID: ${workflow.id}) - ${workflow.active ? 'Active' : 'Inactive'}`);
      });
    }
    
    // Test 3: Get specific workflow details
    if (workflowsArray.length > 0) {
      console.log('\n3. Testing workflow details...');
      const firstWorkflow = workflowsArray[0];
      const workflowResponse = await axios.get(`${N8N_BASE_URL}/workflows/${firstWorkflow.id}`, {
        headers: {
          'X-N8N-API-KEY': N8N_API_TOKEN,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Workflow details retrieved successfully');
      console.log(`   Workflow: ${firstWorkflow.name || 'Unnamed'}`);
      console.log(`   Nodes: ${workflowResponse.data.nodes ? workflowResponse.data.nodes.length : 0}`);
    }
    
    console.log('\n🎉 All tests passed! n8n API is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Status Text: ${error.response.statusText}`);
      if (error.response.data) {
        console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } else if (error.request) {
      console.error('   Network error - n8n might not be running on localhost:5678');
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Make sure n8n is running on http://localhost:5678/');
    console.log('   - Check if the API token is valid');
    console.log('   - Verify n8n API is enabled');
  }
}

// Run the test
testN8nConnection(); 