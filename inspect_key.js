const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf8');
        const vars = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) vars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
        });
        return vars;
    } catch (e) {
        return {};
    }
}

const env = loadEnv();
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
    console.log("No key found");
    process.exit(0);
}

try {
    const parts = key.split('.');
    if (parts.length !== 3) {
        console.log("Key is not a valid JWT (parts !== 3)");
        process.exit(0);
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log("--- KEY INFO ---");
    console.log("Role:", payload.role);
    console.log("Issued At:", new Date(payload.iat * 1000).toISOString());
    if (payload.exp) console.log("Expires:", new Date(payload.exp * 1000).toISOString());
    console.log("Reference:", payload.ref || "N/A");
    console.log("----------------");

    // Also check URL ref
    const url = env.NEXT_PUBLIC_SUPABASE_URL || "";
    const urlRef = url.match(/https:\/\/([^\.]+)\./);
    if (urlRef && payload.ref && urlRef[1] !== payload.ref) {
        console.log("WARNING: Key reference (" + payload.ref + ") does not match URL reference (" + urlRef[1] + ")");
    } else if (urlRef && payload.ref) {
        console.log("Reference Match: OK");
    }

} catch (e) {
    console.error("Error decoding key:", e);
}
