import {
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { ProxyAgent } from "proxy-agent";

const config = useRuntimeConfig();

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

const agent = new ProxyAgent();

const s3Client = new S3Client({
  region: config.region,
  requestHandler: new NodeHttpHandler({ httpAgent: agent, httpsAgent: agent }),
});

/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucketName }),
  );
  return objects.Contents ?? [];
};

/** トレーナーの取得 */
// TODO: トレーナーを取得する S3 クライアント処理の実装
export const findTrainer = async (name) => {
  const object = await s3Client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
    }),
  );
  const trainer = JSON.parse(await streamToString(object.Body));
  //console.log("findTrainer=:", trainer); // 取得したデータを確認(sy2025)
  return trainer;
};

/** トレーナーの追加更新 */
export const upsertTrainer = async (name, trainer) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
      //Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
      Body: JSON.stringify({ name: name, pokemons: [], ...trainer }), //トレーナー名が消えてしまう問題を修正(sy2025)
    }),
  );
  //console.log("trainerName:", name); // 取得したデータを確認(sy2025)
  return result;
};

/** トレーナーの削除 */
// TODO: トレーナーを削除する S3 クライアント処理の実装
export const deleteTrainer = async (name) => {
  const result = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
    }),
  );
  return result;
};