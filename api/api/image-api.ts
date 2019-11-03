import imageApiCredentials from "../image-api-credentials";
import https from "https";

export async function getImage(query: string): Promise<string> {
    return new Promise((resolve, reject) =>
    {
        https.get(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${imageApiCredentials.key}&cx=018248219137266935706:yb6yqjvcfhl&imgType=photo&safe=high&searchType=image`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let dataP = JSON.parse(data);
                console.log(dataP.items[0].link);
                resolve(dataP.items[0].link);
            });
        });
    });
}