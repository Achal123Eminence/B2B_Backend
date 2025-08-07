import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URL_LOCAL = process.env.MONGODB_URL_LOCAL;
export const STAGE = process.env.STAGE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ENCRYPTION_IV = process.env.ENCRYPTION_IV;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY; 
export const ENCRYPTION_ALGO = process.env.ENCRYPTION_ALGO; 

export const ApiUrl = {
    cloud:{
        BASE: "https://api.cloudflare.com/client/v4/accounts",
        GENRATE_UPLOAD_IMG_ROUTE: function ({ACCOUNTID}) {
            return `${this.BASE}/${ACCOUNTID}/images/v1`;
        },
        GENRATE_DELETE_IMG_ROUTE: function ({ ACCOUNTID, imageId }) {
            return `${this.BASE}/${ACCOUNTID}/images/v1/${imageId}`
        }
    }
}
