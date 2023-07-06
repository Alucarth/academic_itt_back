import { extname } from "path";

export const fileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const ext = extname(file.originalname);
    const randomName = Array(6)
    .fill(null)
    .map(() => Math.round(Math.random() * 8).toString(8))
    .join('');
    callback(null, `${randomName}${ext}`)
}

export const fileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)){
        return callback( new Error('Solo estan permitidos formatos de imagen o documentos!'), false);
    }
    callback(null, true);
}
