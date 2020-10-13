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

        // for pe randuri
        // in loc de to si from sa punem username --> un request pt a luat numele de utilizator

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
        const query = `SELECT * FROM messages WHERE "owner"=${ownerId} AND "from"=${ownerId}`
        // {
        //     text: 'SELECT * FROM messages WHERE owner=$1 AND from=$2',
        //     values: [ownerId, ownerId]
        // };

        return await Message.findByQuery(query);
    }

    static async findByOwnerReceived(ownerId) {
        const query = {
            text: 'SELECT * FROM messages WHERE "owner"=$1 AND "to"=$2',
            values: [ownerId, ownerId]
        };

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
}

module.exports = Message;