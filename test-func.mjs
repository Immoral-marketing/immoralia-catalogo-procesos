const fs = require('fs');

async function test() {
    try {
        const res = await fetch("https://cvnuwrzpbvxtdxolwmxf.supabase.co/functions/v1/send-contact-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: "Test Bot",
                email: "test@immoral.es",
                empresa: "Inmortal",
                source: "chatbot",
                comentario: "test"
            })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}
test();
