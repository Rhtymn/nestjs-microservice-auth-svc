import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from './auth/proto/auth.pb';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: protobufPackage,
        protoPath: 'node_modules/grpc-proto/proto/auth.proto',
      },
    },
  );

  await app.listen();
}
bootstrap();
