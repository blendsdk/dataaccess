import { Database } from "../database/Database";
import { Table } from "../database/Table";
import { eQueryMethod, FactoryBuilder } from "../typescript/FactoryBuilder";

/**
 * Interface describing the return value of `createUsersAndRoles()`
 *
 * @export
 * @interface ICreateUsersAndRoles
 */
export interface ICreateUsersAndRoles {
    sys_user: Table;
    sys_role: Table;
    sys_profile: Table;
}

/**
 * Creates a generic user and role table combination
 *
 * @export
 * @param {Database} db
 * @param {FactoryBuilder} fb
 * @returns {ICreateUsersAndRoles}
 */
export function createUsersAndRoles(db: Database, fb: FactoryBuilder): ICreateUsersAndRoles {
    const sys_user = db.addTable("sys_user"),
        sys_role = db.addTable("sys_role"),
        sys_user_role = db.addTable("sys_user_role"),
        sys_profile = db.addTable("sys_profile");

    sys_user
        .primaryKeyColumn()
        .stringColumn("username", { unique: true })
        .stringColumn("password")
        .stringColumn("email", { unique: true })
        .dateTimeColumn("date_created", { default: "now()" })
        .booleanColumn("is_active", { default: "true" });

    sys_user_role
        .referenceColumn("user_id", sys_user)
        .referenceColumn("role_id", sys_role)
        .uniqueConstraint(["user_id", "role_id"]);

    sys_role
        .primaryKeyColumn()
        .stringColumn("role", { unique: true })
        .stringColumn("description", { required: false });

    sys_profile
        .primaryKeyColumn()
        .stringColumn("first_name")
        .stringColumn("last_name")
        .stringColumn("picture")
        .referenceColumn("user_id", sys_user);

    fb.addMethod([
        {
            forTable: sys_user,
            methodName: "findUser",
            parameters: [
                {
                    name: "username",
                    type: "string"
                }
            ],
            queryMethod: eQueryMethod.executeQuerySingle,
            query: "SELECT * FROM sys_user WHERE lower(username)=lower(:username) or lower(email)=lower(:username)"
        },
        {
            forTable: sys_user,
            methodName: "getRoles",
            returnType: "ISysUserRole",
            returnTypeIsArray: true,
            description: "Given a user_id this method returns the user roles",
            parameters: {
                name: "user_id",
                type: "number"
            },
            queryMethod: eQueryMethod.executeQuerySingle,
            query: `
					select
						r.*
					from
						sys_user_role ur
						inner join sys_user u on u.id = ur.user_id
						inner join sys_role r on r.id = ur.role_id
					where
						u.id = :user_id
					`
        }
    ]);
    return { sys_user, sys_role, sys_profile };
}
