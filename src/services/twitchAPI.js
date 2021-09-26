import https from 'https';

const getAccessToken = (callback = res => {}) => {
    const options = {
        hostname: 'id.twitch.tv',
        path: '/oauth2/token'
            + `?client_id=${process.env.T_CLIENT_ID}`
            + `&client_secret=${process.env.T_CLIENT_SECRET}`
            + '&grant_type=client_credentials',
        method: 'POST'
    };

    const responseParser = (response) => {
        let data = '';
    
        response.on('data', (chunk) => {
            data += chunk;
        });
    
        response.on('end', (chunk) => {
            callback(JSON.parse(data));
        });
    };

    console.log("sending access token request");
    console.log(`posting to ${options.hostname}${options.path} with client_id ${process.env.T_CLIENT_ID} and client secret ${process.env.T_CLIENT_SECRET}`);
    const req = https.request(options, responseParser);
    req.end();
}

const getBroadcasterId = (username, accessToken, callback = res => {}) => {
    const options = {
        hostname: 'api.twitch.tv',
        path: `/helix/users?login=${username}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Client-Id': process.env.T_CLIENT_ID
        }
    };

    const responseParser = (response) => {
        let data = '';
    
        response.on('data', (chunk) => {
            data += chunk;
        });
    
        response.on('end', (chunk) => {
            callback(JSON.parse(data));
        });
    };

    console.log("sending user ID request");
    const req = https.request(options, responseParser);
    req.end();
}

const getUserInfo = (username, accessToken, callback = res => {}) => {
    getBroadcasterId(broadcasterName, accessToken, res => {
        if(res?.data[0]?.id) {
            console.log("got user ID: " + res.data[0].id);

            const options = {
                hostname: 'api.twitch.tv',
                path: `/helix/channels?broadcaster_id=${res.data[0].id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Client-Id': process.env.T_CLIENT_ID
                }
            };

            const responseParser = (response) => {
                let data = '';
            
                response.on('data', (chunk) => {
                    data += chunk;
                });
            
                response.on('end', (chunk) => {
                    callback(JSON.parse(data));
                });
            };

            console.log("sending user Info request");
            const req = https.request(options, responseParser);
            req.end();
        } else {
            callback(null);
        }
    });
}

const getClips = (broadcasterName, startDate, endDate, maxNumberOfClips, accessToken, callback = res => {}) => {
    getBroadcasterId(broadcasterName, accessToken, res => {
        if(res?.data[0]?.id) {
            console.log("got user ID: " + res.data[0].id);

            const options = {
                hostname: 'api.twitch.tv',
                path: '/helix/clips'
                    + `?broadcaster_id=${res.data[0].id}`
                    + `&ended_at=${endDate}`
                    + `&first=${maxNumberOfClips}`
                    + `&started_at=${startDate}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Client-Id': process.env.T_CLIENT_ID
                }
            };

            const responseParser = (response) => {
                let data = '';
            
                response.on('data', (chunk) => {
                    data += chunk;
                });
            
                response.on('end', (chunk) => {
                    callback(JSON.parse(data));
                });
            };

            console.log("sending getClips request");
            const req = https.request(options, responseParser);
            req.end();
        } else {
            callback(null);
        }
    });
};

const getClipV5 = (slug, callback = res => {}) => {
    console.log("getting clip info via deprecated API");

    const options = {
        hostname: 'api.twitch.tv',
        path: `/kraken/clips/${slug}`,
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': process.env.T_CLIENT_ID
        }
    };

    const responseParser = (response) => {
        let data = '';
    
        response.on('data', (chunk) => {
            data += chunk;
        });
    
        response.on('end', (chunk) => {
            callback(JSON.parse(data));
        });
    };

    console.log("sending getClip v5 request");
    const req = https.request(options, responseParser);
    req.end();
};

export { getAccessToken , getBroadcasterId, getUserInfo };