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

        let result = await pool.query(query);

        return result.rows;
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