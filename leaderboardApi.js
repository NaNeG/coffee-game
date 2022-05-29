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

export const leaderboardDB = {
    create: function (id, body) {
        return _create(_lb_coll, id, _lb_dirt(body));
    },

    update: function (id, body) {
        return _update(_lb_coll, id, _lb_dirt(body));
    },

    get: async function (id = null) {
        if (id === null) {
            1/0;
            const docs = await _get(_lb_coll);
            return (await docs.json())['documents'].map(d => _lb_clear(d, _extr_name(d)));
        }
        const doc = await _get(_lb_coll, id);
        return _lb_clear(await doc.json());
    },

    getAll: async function (count = null, ascending = null) {
        const docs = await _getAll(_lb_coll, count, ascending);
        return Array.prototype.map.call((await docs.json())['documents'], d => _lb_clear(d, _extr_name(d)));
    },
    
    del: function (id) {
        return _delete(_lb_coll, id);
    }
}