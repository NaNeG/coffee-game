import { _create, _update, _delete, _get, _getAll } from "./firestoreApi.js";
import { GameModes } from "./helpers.js";

function _extr_name(doc) {
    const name = doc.name;
    return name.substring(name.lastIndexOf('/') + 1);
}

function _lb_dirt(doc) {
    return {fields: {points: {integerValue: doc.points}}};
}

function _lb_clear(doc, id=null) {
    const cleared = {points: Number(doc.fields.points.integerValue)};
    if (id !== null) { cleared.id = id };
    return cleared;
}

export class Database {
    constructor(coll_name) {
        this.collection_name = coll_name;
    }

    create(id, body) {
        return _create(this.collection_name, id, _lb_dirt(body));
    }

    update(id, body) {
        return _update(this.collection_name, id, _lb_dirt(body));
    }

    async get(id) {
        const doc = await _get(this.collection_name, id);
        const docJson = await doc.json();
        if (!('error' in docJson)) {
            return _lb_clear(docJson);
        }
        if (docJson.error.code === 404) {
            return null;
        }
        throw new Error(docJson.error.message);
    }

    async getAll(count = Infinity, ascending = null) {
        const docs = await _getAll(this.collection_name, count, ascending);
        const docsJson = await docs.json();
        return 'documents' in docsJson
            ? Array.prototype.map.call(docsJson.documents, d => _lb_clear(d, _extr_name(d)))
            : [];
    }
    
    del(id) {
        return _delete(this.collection_name, id);
    }
}

export const leaderboardDBs = Object.fromEntries(
    Object.keys(GameModes).map(mode => [mode, new Database(mode)])
);
