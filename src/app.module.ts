// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { databaseConfig } from './config/database.config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       //configModule.forRoot is used for loading environmnt variables
//       isGlobal: true,
//       envFilePath: '.env', //makes sure that your .env variables are availabe everywhere
//     }),
//     SequelizeModule.forRoot(databaseConfig), //this line connects to postgresSQL, it uses configurartion from database.config.ts to initialse orm
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

// Import all models
import { User } from './models/user.model';
import { Form } from './models/form.model';
import { FormField } from './models/form-fields.model';
import { FormSubmission } from './models/form-submission.model';
import { FieldResponse } from './models/field-response.model';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
// import { FormField } from './models/form-field.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      ...databaseConfig,
      models: [User, Form, FormField, FormSubmission, FieldResponse], // Register all models
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
