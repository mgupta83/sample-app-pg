import { mkdir, writeFile, copyFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deployDir = resolve(__dirname, "deploy");
const distDir = resolve(deployDir, "dist");

async function prepareDeployment() {
  try {
    console.log("Preparing deployment...");

    // Clean deploy directory except dist (which rolldown creates)
    // We don't clean dist here as rolldown already created it

    // Create host.json
    const hostJson = {
      version: "2.0",
      extensionBundle: {
        id: "Microsoft.Azure.Functions.ExtensionBundle",
        version: "[4.*, 5.0.0)",
      },
      logging: {
        applicationInsights: {
          samplingSettings: {
            isEnabled: true,
            maxTelemetryItemsPerSecond: 20,
          },
        },
      },
    };

    await writeFile(
      resolve(deployDir, "host.json"),
      JSON.stringify(hostJson, null, 2),
      "utf-8"
    );
    console.log("✓ Created host.json");

    // Create package.json for deploy
    const packageJson = {
      name: "azure-functions-app",
      version: "1.0.0",
      type: "module",
      description: "Azure Functions app",
      main: "dist/index.js",
      dependencies: {
        "@azure/functions": "^4.7.0",
      },
    };

    await writeFile(
      resolve(deployDir, "package.json"),
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
    console.log("✓ Created package.json");

    // Create time function directory and function.json
    const timeFunctionDir = resolve(deployDir, "time");
    await mkdir(timeFunctionDir, { recursive: true });

    const functionJson = {
      bindings: [
        {
          authLevel: "anonymous",
          type: "httpTrigger",
          direction: "in",
          name: "req",
          methods: ["get", "post"],
          route: "time",
        },
        {
          type: "http",
          direction: "out",
          name: "res",
        },
      ],
      scriptFile: "../dist/index.js",
      entryPoint: "timeHandler",
    };

    await writeFile(
      resolve(timeFunctionDir, "function.json"),
      JSON.stringify(functionJson, null, 2),
      "utf-8"
    );
    console.log("✓ Created function.json");

    console.log("✓ Deployment preparation complete!");
  } catch (error) {
    console.error("Error preparing deployment:", error);
    process.exit(1);
  }
}

prepareDeployment();
