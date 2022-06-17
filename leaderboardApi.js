import { _create, _update, _delete, _get, _getAll } from "./firestoreApi.js";

function _extr_name(doc) {
    const name = doc['name'];
    return name.substring(name.lastIndexOf('/') + 1);
}

function _lb_dirt(doc) {
    return {'fields': {'points': {'integerValue': str(doc['points'])}}};
}

function _lb_clear(doc, id=null) {
    const cleared = {'points': doc['fields']['points']['integerValue']};
    if (id !== null) { cleared['id'] = id };
    return cleared;
}

const _lb_coll = 'leaderboard';

export class database {
    constructor(coll_name) {
        this._coll_name = coll_name;
    }

    create(id, body) {
        return _create(this._coll_name, id, _lb_dirt(body));
    }

    update(id, body) {
        return _update(this._coll_name, id, _lb_dirt(body));
    }

    async get(id = null) {
        if (id === null) {
            1/0;
            const docs = await _get(this._coll_name);
            return (await docs.json())['documents'].map(d => _lb_clear(d, _extr_name(d)));
        }
        const doc = await _get(this._coll_name, id);
        return _lb_clear(await doc.json());
    }

    async getAll(count = Infinity, ascending = null) {
        const docs = await _getAll(this._coll_name, count, ascending);
        return Array.prototype.map.call((await docs.json())['documents'], d => _lb_clear(d, _extr_name(d)));
    }
    
    del(id) {
        return _delete(this._coll_name, id);
    }
}

export const leaderboardDB = new database(_lb_coll);
