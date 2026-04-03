import { connectDb } from './config/db.js';
import { app } from './app.js';

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDb();
  app.listen(PORT, () => console.log(`CivicFix API listening on ${PORT}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
