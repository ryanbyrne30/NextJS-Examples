function getEnvVariableOrFail(variable: string) {
  const value = process.env[variable];
  console.log("Env", value);
  if (value === undefined)
    throw new Error(`Environment Variable not set: ${variable}`);
  return value;
}

getEnvVariableOrFail("AWS_ACCESS_KEY_ID");
getEnvVariableOrFail("AWS_SECRET_ACCESS_KEY");
export const AWS_BUCKET_NAME = getEnvVariableOrFail("AWS_BUCKET_NAME");
export const AWS_REGION = getEnvVariableOrFail("AWS_REGION");
