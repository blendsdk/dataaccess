import { DependencySorter } from "../src/database/DependencySorter";
import { PostgreSQLDatabase } from "../src/postgresql/PostgreSQLDatabase";

const db = new PostgreSQLDatabase("test"),
    table1 = db.addTable("table1"),
    table2 = db.addTable("table2"),
    table4 = db.addTable("table4"),
    table5 = db.addTable("table5"),
    table3 = db.addTable("table3"),
    table7 = db.addTable("table7"),
    table6 = db.addTable("table6");

table1.primaryKeyColumn();

table2
    .primaryKeyColumn()
    .referenceColumn("table3_id", table3)
    .referenceColumn("table6_id", table6);

table3
    .primaryKeyColumn()
    .referenceColumn("table5_id", table5)
    .referenceColumn("table7_id", table7);

table4.primaryKeyColumn();

table5
    .primaryKeyColumn() //
    .referenceColumn("table6_id", table6);

table6.primaryKeyColumn();

table7.primaryKeyColumn();

db.create();
