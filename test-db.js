
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await prisma.$connect();
        console.log('Successfully connected to MongoDB!');

        const count = await prisma.knowledgeEntry.count();
        console.log(`Knowledge entries count: ${count}`);

    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
