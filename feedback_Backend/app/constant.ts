
export class Constants {
    //secret key for token encryption.
    public static readonly secret_key: string = 'secret_key_jwt_token'
    public static readonly jwt_key: string = 'secrets'


    //mongodb.
    public static readonly MONGO_URI: string = 'mongodb://'


    //cron. number of feedback to be generated.
    public static readonly numberOfFeedback: number  = 3
}