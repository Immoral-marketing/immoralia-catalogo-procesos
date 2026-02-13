const url = "https://cvnuwrzpbvxtdxolwmxf.supabase.co/functions/v1/process-onboarding";
const origin = "https://immoral.es";

async function testCors() {
    console.log("--- Testing OPTIONS (Preflight) ---");
    const optionsRes = await fetch(url, {
        method: "OPTIONS",
        headers: {
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,x-client-info,apikey,content-type",
            "Origin": origin
        }
    });

    console.log("Status:", optionsRes.status);
    console.log("Headers:", JSON.stringify(Object.fromEntries(optionsRes.headers.entries()), null, 2));

    console.log("\n--- Testing POST (Actual) ---");
    const postRes = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bnV3cnpwYnZ4dGR4b2x3bXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDQ3MjksImV4cCI6MjA4NTE4MDcyOX0.p2sCrjy2o3oDZXbsaSWeyy74s_3I9IMlfugX645pUgo",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bnV3cnpwYnZ4dGR4b2x3bXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDQ3MjksImV4cCI6MjA4NTE4MDcyOX0.p2sCrjy2o3oDZXbsaSWeyy74s_3I9IMlfugX645pUgo",
            "Origin": origin
        },
        body: JSON.stringify({
            nombre: "CORS Test",
            email: "test@example.com",
            answers: { sector: "Other" }
        })
    });

    console.log("Status:", postRes.status);
    const body = await postRes.text();
    console.log("Body:", body);
}

testCors();
