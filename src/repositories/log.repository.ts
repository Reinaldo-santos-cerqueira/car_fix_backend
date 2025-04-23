/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    query: {
        async $allOperations({ model, operation, args, query }) {
            if (model === "Log") {
                return query(args);
            }

            let before: any = null;
            if (["update", "delete"].includes(operation) && model) {
                before = await (prisma as any)[model]?.findUnique({ where: args.where });
            }

            const result = await query(args);

            let after: any = null;
            if (["create", "update"].includes(operation)) {
                after = result;
            }

            if (model && ["create", "update", "delete", "deleteMany"].includes(operation)) {
                await prisma.log.create({
                    data: {
                        tableName: model,
                        action: operation.toUpperCase(),
                        oldData: before ?? Prisma.JsonNull,
                        newData: after ?? Prisma.JsonNull,
                    },
                });
            }

            return result;
        },
    },
});

export { prisma };