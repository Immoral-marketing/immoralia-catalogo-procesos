import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const SUPABASE_URL = "https://cvnuwrzpbvxtdxolwmxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bnV3cnpwYnZ4dGR4b2x3bXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDQ3MjksImV4cCI6MjA4NTE4MDcyOX0.p2sCrjy2o3oDZXbsaSWeyy74s_3I9IMlfugX645pUgo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLead(payload) {
    console.log(`Testing lead with source: ${payload.source}...`);
    try {
        const { data, error } = await supabase.functions.invoke("send-contact-email", {
            body: payload
        });

        if (error) {
            console.error("Error:", JSON.stringify(error, null, 2));
            return false;
        } else {
            console.log("Success:", JSON.stringify(data, null, 2));
            return true;
        }
    } catch (err) {
        console.error("Exception:", err.message);
        return false;
    }
}

async function runTests() {
    // 1. Test Chatbot Lead (should pass without processes)
    await testLead({
        nombre: "Test Chatbot",
        email: "chatbot-test@immoral.es",
        empresa: "Particular",
        comentario: "Prueba desde chatbot sin procesos",
        source: 'chatbot',
        selectedProcesses: []
    });

    // 2. Test Catalog Lead (should fail without processes if my logic works, 
    // but Note: I haven't deployed the function yet, so this would test the current production one)
    // Actually, I can't deploy it easily. 
    // I'll assume the user will deploy it or I'll just verify the logic locally if I can.
}

// runTests();
console.log("Script prepared. Note: Requires deployment of the edge function to test remotely.");
