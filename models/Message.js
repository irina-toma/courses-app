const pool = require("./pool.js");
const utils = require("../controllers/utils/utils.js");
const {
    ServerError
} = require("../controllers/utils/errors.js");

class Message {
    constructor(to, from, owner, body, title, flags, toList) {
        this.to = to;
        this.from = from;
        this.owner = owner;
        this.body = body;
        this.title = title;
        this.flags = flags;
        this.toList = toList;
    }

    static async findAll() {
        const query = 'SELECT * FROM messages';
        return await Message.findByQuery(query);
    }

    static async findByQuery(query) {
        let result = await pool.query(query);

        return result.rows;
    }

    static async findByOwner(ownerId) {
        const query = {
            text: 'SELECT * FROM messages WHERE owner=$1',
            values: [ownerId]
        };

        return await Message.findByQuery(query);
    }

    static async findByOwnerSent(ownerId) {
        const query = `select m.id, m.title, m.to, m.from, m.flags, m.body, m.to_list, u.username from messages as m, users as u where m.owner = ${ownerId} and m.from = ${ownerId} and m.to = u.id`;
        return await Message.findByQuery(query);
    }

    static async findByOwnerReceived(ownerId) {
        const query = `select m.id, m.title, m.to, m.from, m.flags, m.body, m.to_list, u.username from messages as m, users as u where m.owner = ${ownerId} and m.to = ${ownerId} and m.from = u.id`;
        return await Message.findByQuery(query);
    }    

    async save() {
        const stm = {
            text: 'INSERT INTO messages("to", "from", "owner", "body", "title", "flags", "to_list") VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [this.to, this.from, this.owner, this.body, this.title, this.flags, this.toList],
        };

        let result = await pool.query(stm);

        return result;
    }

    static async addMailingList(name, usernameList) {
        // const stm = {
        //     text: 'SELECT id from users WHERE username IN ($1)',
        //     values: [usernameList]
        // }

       
        let names = usernameList.map(user => `'${user}'`).join(',');
        const stm = `SELECT id from users WHERE username IN (${names});`;

        let result = await pool.query(stm);
        let ids = result.rows;

        if (ids.length > 0) {
            for (let id of ids) {
                const stm = {
                    text: "INSERT INTO mailing_list('name', 'user_id') VALUES ('$1', $2)", // TODO: fix this
                    values: [name, id]
                }
                await pool.query(stm);
            }
        }
        
    }
}

module.exports = Message;