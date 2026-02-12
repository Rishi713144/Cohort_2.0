import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { Todo, User } from "./db";
import { todoRouter } from './routers/todo';
import { userRouter } from './routers/user';
import { router } from './trpc';
export const SECRET = process.env.JWT_SECRET || 'SECr3t';

mongoose.connect(process.env.MONGODB_URI || '', { dbName: "todo" });

// using trpc
export const appRouter = router({
    user: userRouter,
    todo: todoRouter,
});


// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log(token);
            return new Promise<{ db: { Todo: typeof Todo, User: typeof User }, userId?: string }>((resolve) => {
                jwt.verify(token, SECRET, (err, user) => {
                    if (user) {
                        //@ts-ignore
                        resolve({ userId: user.userId as string, db: { Todo, User } });
                    } else {
                        resolve({ db: { Todo, User } });
                    }
                });
            })
        }

        return {
            db: { Todo, User },
        }
    }
});

server.listen(3000);
