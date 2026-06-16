import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import readline from 'readline';

const args = process.argv.slice(2);
const tokenIndex = args.indexOf('--token');
const urlIndex = args.indexOf('--url');

if (tokenIndex === -1 || urlIndex === -1) {
  console.error("Error: Missing --url or --token arguments.");
  process.exit(1);
}

const DROPLET_URL = args[urlIndex + 1];
const TOKEN = args[tokenIndex + 1];

console.error(`[Bridge] Connecting to Streamable HTTP server at: ${DROPLET_URL}`);

async function run() {
  try {
    const transport = new StreamableHTTPClientTransport(new URL(DROPLET_URL), {
      requestInit: {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'X-MCP-Token': TOKEN
        }
      }
    });

    transport.onmessage = (message) => {
      process.stdout.write(JSON.stringify(message) + '\n');
    };

    transport.onerror = (error) => {
      console.error("[Bridge] Remote Transport Error:", error);
    };

    transport.onclose = () => {
      console.error("[Bridge] Connection closed by remote server.");
      process.exit(0);
    };

    await transport.start();
    console.error("[Bridge] Connected successfully! Relaying messages.");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const message = JSON.parse(line);
        transport.send(message).catch((err) => {
          console.error("[Bridge] Failed to forward message to remote:", err);
        });
      } catch (err) {
        console.error("[Bridge] Invalid JSON on stdin:", err);
      }
    });

  } catch (error) {
    console.error("[Bridge] Initialization failed:", error);
    process.exit(1);
  }
}

run();