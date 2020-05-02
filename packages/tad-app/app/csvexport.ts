import reltab from "reltab";
import reltabSqlite from "reltab-sqlite";

import csv from "fast-csv";

import fs from "fs";
import { BrowserWindow } from "electron";

declare var appRtc: reltabSqlite.SqliteContext;

// maximum number of items outstanding before pause and commit:
// Some studies of sqlite found this number about optimal
const BATCHSIZE = 10000;
export const exportAs = async (
  win: BrowserWindow,
  saveFilename: string,
  filterRowCount: number,
  query: reltab.QueryExp
) => {
  let exportPercent = 0;
  win.webContents.send("open-export-dialog", {
    openState: true,
    saveFilename,
    exportPercent,
  });
  const csvStream = csv.format({
    headers: true,
  });
  const writableStream = fs.createWriteStream(saveFilename);
  csvStream.pipe(writableStream);
  const schema = appRtc.getSchema(query); // Map entries in a row object to array of [displayName, value] pairs

  const mapRow = (row: reltab.Row) => {
    return schema.columns.map((cid) => [schema.displayName(cid), row[cid]]);
  };

  let offset = 0;
  let percentComplete = 0;

  while (offset < filterRowCount) {
    let limit = Math.min(BATCHSIZE, filterRowCount - offset);
    let res = await appRtc.evalQuery(query, offset, limit);
    res.rowData.map((row) => {
      csvStream.write(mapRow(row));
    });
    offset += res.rowData.length;
    percentComplete = offset / filterRowCount;
    win.webContents.send("export-progress", {
      percentComplete,
    });
  }

  csvStream.end();
  win.webContents.send("export-progress", {
    percentComplete: 1,
  });
};
