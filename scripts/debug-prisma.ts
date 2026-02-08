import { prisma } from '../lib/prisma';

console.log('Prisma keys:', Object.keys(prisma));
console.log('AssetCategory in prisma:', 'assetCategory' in prisma);
console.log('ItemCategory in prisma:', 'itemCategory' in prisma);
process.exit(0);
