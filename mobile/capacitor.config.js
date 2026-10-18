// The Next.js app is server-rendered, so the native shell loads it live from APP_URL instead of bundling it.
// Local phone test: APP_URL=http://<your-LAN-IP>:3838   Production: APP_URL=https://your-domain
const url = process.env.APP_URL;
if (!url) throw new Error("Set APP_URL, e.g. APP_URL=http://192.168.1.106:3838 npm run sync");

/** @type {import('@capacitor/cli').CapacitorConfig} */
module.exports = {
  appId: "ir.fundersclub.app",
  appName: "ایران‌فاندرز",
  webDir: "www",
  backgroundColor: "#000000",
  server: { url, cleartext: url.startsWith("http:"), errorPath: "index.html" },
};
