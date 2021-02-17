import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import 'dotenv/config';

import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

// session config
const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        //TODO: add in initial roles here
    }
}); 

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        // TODO: add data seeding here
    },
    lists: createSchema({
        //schema items go in here
        User,
        Product,
        ProductImage,
    }),
    ui: {
        // show the UI only for people who have pass this test
        isAccessAllowed: ({ session }) => {
            // console.log(session);
            return !!session?.data;
        },
    },
    session: withItemData(statelessSessions(sessionConfig), {
        // GraphQL Query
        User: `id name email`
    })
}));