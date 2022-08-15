import Cookie from './Cookie';

const buildParams = (params) => {
    return new URLSearchParams(params).toString();
};

const buildBody = (body) => {
    return JSON.stringify(body);
};

const request = async (
    method,
    endpoint,
    params,
    body,
    signal,
    headers
) => {
    try {
        const token = Cookie.get('token');
        const defaultHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            Authorization: token ? `Bearer ${token}` : '',
        };

        params = params ? `?${buildParams(params)}` : '';

        body = body && method !== 'GET' ? buildBody(body) : null;

        // const { NODE_ENV } = process.env;

        // const API_URL =
        //     NODE_ENV === 'development'
        //         ? process.env.REACT_APP_API_URL
        //         : window.API_URL;

        const url = `http://localhost:3001/api${endpoint}${params}`;

        // console.log(url, body);

        let request = await fetch(url, {
            method,
            signal,
            headers: { ...defaultHeaders, ...headers },
            body,
        });

        request.response = await request.json();

        if (!request.response.success) throw request;

        return request.response;
    } catch (err) {
        if (!signal || (signal && 'aborted' in signal && !signal.aborted)) {
            if (err.status === 403) {
                window.location.href = '/forbidden';
            } else if (err.status !== 409) {
                console.log(err);
                }

                if (err.status === 307 || err.status === 401) {
                    window.location.href = '/logout';
                }
            }

            let response = err && 'response' in err ? err.response : {};

            response.status = err.status;

            return response;
        }
    }

export default request;
