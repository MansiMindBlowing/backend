import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      //configModule.forRoot is used for loading environmnt variables
      isGlobal: true,
      envFilePath: '.env', //makes sure that your .env variables are availabe everywhere
    }),
    SequelizeModule.forRoot(databaseConfig), //this line connects to postgresSQL, it uses configurartion from database.config.ts to initialse orm
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
