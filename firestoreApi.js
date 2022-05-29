const base_url = 'https://firestore.googleapis.com/v1/projects/coffee-game-db/databases/(default)/documents';

export async function _create(coll, name, body) {
    const url = `${base_url}/${coll}/${name}`;
    // return r.patch(url, str(body));
    await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(body)
    });
}

export async function _update(coll, name, body) {
    const url = `${base_url}/${coll}/${name}?currentDocument.exists=true`;
    await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(body)
    });
}

export async function _delete(coll, name) {
    const url = `${base_url}/${coll}/${name}`;
    await fetch(url, {
        method: 'DELETE'
    });
}

export function _get(coll, name = null) {
    let url;
    if (name === null) {
        url = `${base_url}/${coll}`;
    } else {
        url = `${base_url}/${coll}/${name}`;
    }
    return fetch(url);
}

export function _getAll(coll, count = Infinity, ascending = null) {
    const url = new URL(`${base_url}/${coll}`);
    if (count !== null && count !== Infinity) { url.searchParams.append('pageSize', count); }
    if (ascending !== null) { url.searchParams.append('orderBy', ascending ? 'points' : 'points desc'); }
    return fetch(url);
}