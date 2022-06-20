export const obj = (str: string) => {
    const k = str.split('=');
    const a = k[0].trim();
    const b = JSON.parse(k[1].trim());
    const o = {};
    Object.defineProperty(o, a,
        {
            value: b, writable: true, enumerable: true, configurable: true
        })
    return o;
}

export const process = (part: { header: any; info: any; part: any; }) => {
    const header = part.header.split(';');
    const name = obj(header[1]);
    const fileName = header[2] ? obj(header[2]) : {};
    const type = { type: part.info ? part.info.split(':')[1].trim() : null };
    const data = { data: part.info ? part.part : part.part.toString() };
    const file = {
        ...name,
        ...fileName,
        ...type,
        ...data
    };
    return file;
}

const parse = (body: string, boundary: string | any[]) => {
    const multipartBodyBuffer = Buffer.from(body, "binary");
    let lastline = "";
    let header = "";
    let info = "";
    let state = 0;
    let buffer: number[] = [];
    const allParts: any = {};
    multipartBodyBuffer.forEach((oneByte, index) => {
        const prevByte = index > 0 ? multipartBodyBuffer[index - 1] : null;
        const newLineDetected = !!(oneByte === 0x0a && prevByte === 0x0d);
        const newLineChar = !!(oneByte === 0x0a || oneByte === 0x0d);

        if (!newLineChar) {
            lastline += String.fromCharCode(oneByte);
        }

        if (state === 0 && newLineDetected) {
        if (`--${boundary}` === lastline) {
            state = 1;
        }
        lastline = "";
        } else if (state === 1 && newLineDetected) {
            header = lastline;
            state = 2;
            lastline = "";
        } else if (state === 2 && newLineDetected) {
            info = lastline;
            state = info && info.includes("Content-Type") ? 3 : 4;
            lastline = "";
        } else if (state === 3 && newLineDetected) {
            state = 4;
            buffer = [];
            lastline = "";
        } else if (state === 4) {
            if (lastline.length > boundary.length + 4) lastline = ""; // mem save
            if (`--${boundary}` === lastline) {
                const j = buffer.length - lastline.length;
                const part = buffer.slice(0, j - 1);
                const file: any = process({ header, info, part: Buffer.from(part) });
                allParts[file.name] = file.type
                ? { type: file.type, data: file.data }
                : file.data;
                buffer = [];
                lastline = "";
                state = 5;
                header = "";
                info = "";
            } else {
                buffer.push(oneByte);
            }
            if (newLineDetected) lastline = '';
        } else if (state === 5) {
            if (newLineDetected) { state = 1; }
        }
    });
    return allParts;
};

/**
 * read the boundary from the content-type header sent by the http client
 * this value may be similar to:
 * 'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
 * @param {*} header
 */
const getBoundary = (header: string) => {
    const items = header.split(';');
    let boundary = '';
    if (items) {
        items.forEach((element) => {
            const item = element.trim();
            if (item.indexOf('boundary') >= 0) {
                const k = item.split('=');
                boundary = k[1].trim();
            }
        });
    }
    return boundary;
}


export default {
    getBoundary,
    parse
}