import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: path.join(__dirname, 'prisma', 'schema.prisma'),

    // URL de connexion pour les migrations
    datasource: {
        url:
            process.env.DATABASE_URL ||
            'postgresql://projet_user:projet_password@localhost:5432/projet_web_db?schema=public',
    },
});
