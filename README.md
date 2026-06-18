# @duke7able/mcp-bridge

A Streamable HTTP bridge to connect Claude Desktop to remote Model Context Protocol (MCP) servers.

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-remote-server": {
      "command": "npx",
      "args": [
        "-y",
        "@duke7able/mcp-bridge",
        "--url",
        "https://YOUR_URL",
        "--token",
        "YOUR_TOKEN"
      ]
    }
  }
}