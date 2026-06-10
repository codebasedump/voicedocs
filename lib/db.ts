import mongoose from "mongoose";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI;
// Public DNS resolvers used to look up the Atlas SRV record. Many home/ISP
// routers refuse SRV queries ("querySrv ECONNREFUSED"); these don't.
const DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache the connection across hot reloads / serverless invocations.
declare global {
  var _voicedocsMongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._voicedocsMongoose ?? { conn: null, promise: null };
global._voicedocsMongoose = cached;

/**
 * If given a `mongodb+srv://` URI, resolve the SRV + TXT records ourselves
 * (through a resolver pinned to public DNS) and return a plain `mongodb://`
 * URI with the explicit host list — so we never rely on the driver's own
 * SRV lookup, which can fail on restrictive networks.
 */
async function resolveConnectionUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) return uri; // already a standard URI

  const url = new URL(uri);
  const srvHost = url.hostname;

  const resolver = new dns.promises.Resolver();
  resolver.setServers(DNS_SERVERS);

  const [srvRecords, txtRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${srvHost}`),
    resolver.resolveTxt(srvHost).catch(() => [] as string[][]),
  ]);

  const seedList = srvRecords
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  // Merge query params: original URI params + TXT params (authSource, replicaSet)
  const params = new URLSearchParams(url.search);
  const txtParams = new URLSearchParams(txtRecords.flat().join("&"));
  txtParams.forEach((v, k) => {
    if (!params.has(k)) params.set(k, v);
  });
  params.set("ssl", "true"); // Atlas requires TLS

  const credentials = url.username
    ? `${url.username}:${url.password}@`
    : "";

  return `mongodb://${credentials}${seedList}/?${params.toString()}`;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = resolveConnectionUri(MONGODB_URI).then((uri) =>
      mongoose.connect(uri, { dbName: "voicedocs" })
    );
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow the next request to retry
    throw err;
  }
  return cached.conn;
}
