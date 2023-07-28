export class Utils {
  public static getAWSConfig() {
    return {
      endpoint: process.env.AWS_ENDPOINT,
    };
  }
}
