import { Response } from "express";
import { ServerContext, allEntities, IdEntity, SqlDatabase } from "@remult/core";
import { Pool } from "pg";
import { PostgresDataProvider, PostgresSchemaBuilder } from "@remult/server-postgres";
import { verifySchemaExistance, PostgresSchemaWrapper } from "./serverInit";
import { Families } from "../families/families";
import { Sites } from "../sites/sites";
import { Helpers } from "../helpers/helpers";

export async function dataMigration(res: Response) {
    try {
        console.time('data-migration');
        let schema = process.env.MIGRATION_SCHEMA;
        if (!schema || schema.length == 0 || schema == Sites.guestSchema) {
            res.send("invalid schema");
            return;
        }
        let source = new ServerContext();

        {
            let sourcePool = new Pool({
                connectionString: process.env.MIGRATION_SOURCE_DATABASE_URL,
                ssl: true
            });

            let targetPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: true
            });
            source.setDataProvider(new SqlDatabase(new PostgresDataProvider(sourcePool)));

            // debugger;
            //return;
            verifySchemaExistance(targetPool, schema);
            var w = new PostgresSchemaWrapper(targetPool, schema);
            var psw = new SqlDatabase( new  PostgresDataProvider(w));
            let builder = new PostgresSchemaBuilder(psw, schema);
            let r = "";
            await psw.transaction(async tdp => {
                let target = new ServerContext();
                target.setDataProvider(tdp);

                for (const entity of allEntities) {
                    let x = source.for(entity).create();
                    if (x.defs.dbName.toLowerCase().indexOf('from ') < 0) {
                        await builder.createIfNotExist(x);

                        let rows = await source.for(entity).iterate();
                        console.log(x.defs.dbName + ": " + await rows.count());
                        r += x.defs.dbName + ": " +await  rows.count() + "\r\n";
                        for await (const r of rows) {
                            let tr = target.for(entity).create();
                            if (tr instanceof IdEntity)
                                tr.setEmptyIdForNewRow();
                            for (const col of r.columns) {
                                tr.columns.find(col).value = col.value;
                            }
                            if (tr instanceof Families)
                                tr.disableOnSavingRow = true;
                            if (tr instanceof Helpers)
                                tr._disableOnSavingRow = true;
                            await tr.save();

                        }
                    }
                }
            });
            console.log('done');
            console.timeEnd('data-migration');
            res.send(r);

        }

    }


    catch (error) {
        res.send("error:" + JSON.stringify(error));
    }
}