import {PrismaClient as MongoClient} from './generated/client-mongo';
import {PrismaClient as MysqlClient} from './generated/client-mysql';
import {PrismaClient as PostgresClient} from './generated/client';

const prismaPostgres = new PostgresClient();
const prismaMongo = new MongoClient();
const prismaMysql = new MysqlClient();

async function main() {
  const users = await prismaPostgres.user.findMany();
  const channels = await prismaPostgres.channel.findMany();
  const messages = await prismaPostgres.message.findMany();

  const promiseMysqlUsers = prismaMysql.user.createMany({ data: users });
  const promiseMysqlChannels = prismaMysql.channel.createMany({ data: channels });
  const promiseMysqlMessages = prismaMysql.message.createMany({ data: messages });
  await Promise.all([promiseMysqlUsers, promiseMysqlChannels, promiseMysqlMessages]);
  
  const promiseMongoUsers = prismaMongo.user.createMany({ data: users });
  const promiseMongoChannels = prismaMongo.channel.createMany({ data: channels });
  const promiseMongoMesages = prismaMongo.message.createMany({ data: messages });
  await Promise.all([promiseMongoUsers, promiseMongoChannels, promiseMongoMesages]);
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prismaPostgres.$disconnect()
    await prismaMongo.$disconnect()
    await prismaMysql.$disconnect()
  })
