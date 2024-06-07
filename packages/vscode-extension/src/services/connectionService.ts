import { LangugageClientManager } from '../managers/languageClientManager';
import { PersistentConnectionManager } from '../managers/persistentConnectionManager';
import { ConnectionRepository } from '../repositories/connectionRepository';
import { Connection } from '../types/connection';
import { MethodName } from '../types/methodName';

export async function testConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  return await PersistentConnectionManager.instance.connectionIsSuccessful(
    connection,
    password,
  );
}

export async function addOrUpdateConnection(
  connection: Connection,
  password: string,
): Promise<boolean> {
  const successful =
    await PersistentConnectionManager.instance.connectionIsSuccessful(
      connection,
      password,
    );

  if (!successful) {
    return false;
  }

  connection = await ConnectionRepository.instance.setConnection(
    connection,
    password,
  );

  await connectToConnection(connection, password);

  return true;
}

export async function toggleConnection(
  key: string,
  connected: boolean,
): Promise<boolean> {
  let connection = ConnectionRepository.instance.getConnection(key);
  const password = await ConnectionRepository.instance.getPasswordForConnection(
    key,
  );
  if (
    await PersistentConnectionManager.instance.connectionIsSuccessful(
      connection,
      password,
    )
  ) {
    connection = await ConnectionRepository.instance.toggleConnection(
      key,
      connected,
    );
    await LangugageClientManager.instance.sendNotification(
      MethodName.ConnectionUpdated,
      connection,
    );
    return true;
  }
  return false;
}

export async function deleteConnection(key: string): Promise<void> {
  const connection = ConnectionRepository.instance.getConnection(key);
  await ConnectionRepository.instance.deleteConnection(key);
  await LangugageClientManager.instance.sendNotification(
    MethodName.ConnectionDeleted,
    connection,
  );
  await PersistentConnectionManager.instance.closeConnection();
}

async function connectToConnection(
  connection: Connection,
  password: string,
): Promise<void> {
  if (connection.connect) {
    await PersistentConnectionManager.instance.updateConnection(
      connection,
      password,
    );
    await LangugageClientManager.instance.sendNotification(
      MethodName.ConnectionUpdated,
      connection,
    );
  }
}
