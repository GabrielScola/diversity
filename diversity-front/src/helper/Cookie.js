import Cookie from 'js-cookie';

const get = (name) => {
    return Cookie.get(name);
}

const set = (name, value) => {
    Cookie.set(name, value, {
        sameSite: 'strict',
        expires: 0.0416667, // 1 horas
    });
}

const remove = (name) => {
    Cookie.remove(name);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {get, set, remove};