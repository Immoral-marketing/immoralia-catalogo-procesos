// Verification Script for ContactForm Error Logic (File Output Version)
import fs from 'fs';

const LOG_FILE = 'verify_log.txt';

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
}

// Clear log file
if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
}

async function testLogic(scenario) {
    log(`\n=== SCENARIO: ${scenario} ===`);

    const mockInvoke = async () => {
        if (scenario === '500_error') {
            return { error: { status: 500, message: 'Internal Server Error', code: 500 }, data: null };
        }
        if (scenario === 'network_error') {
            throw new Error('Network request failed');
        }
        if (scenario === 'timeout') {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { data: 'success', error: null };
        }
        return { data: 'success', error: null };
    };

    try {
        const invokePromise = mockInvoke();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 200);
        });

        // The exact logic in the component
        const { data, error } = await Promise.race([invokePromise, timeoutPromise]);

        if (error) {
            throw error;
        }
        log("Success: Email sent");

    } catch (error) {
        let description = "No hemos podido enviar tu solicitud. Comprueba tu conexión e inténtalo de nuevo. Si el problema persiste, escríbenos a team@immoral.com";

        // Logic check
        if (error?.status === 500 || error?.code === 500 || error?.message?.includes('500')) {
            description = "Algo ha fallado por nuestra parte. Estamos trabajando en solucionarlo. Puedes intentarlo en unos minutos o contactarnos directamente";
        } else if (error?.message === 'Request timed out') {
            description = "La solicitud está tardando más de lo normal. Por favor, espera un momento o inténtalo de nuevo";
        }

        log(`FINAL DESCRIPTION: "${description}"`);
    }
}

async function main() {
    await testLogic('500_error');
    await testLogic('timeout');
    await testLogic('network_error');
}

main();
