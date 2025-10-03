import {
  Injectable,
  ConflictException,
  NotFoundException,
  //   UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Register new user
  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create user
    const user = await this.userModel.create({
      email: createUserDto.email,
      password_hash: hashedPassword,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      role: createUserDto.role || 'user',
      created_by: null, // Self-registration
      updated_by: null,
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return userWithoutPassword;
  }

  // Validate user for login
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email, is_deleted: false, is_active: true },
    });

    if (!user) {
      return null;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Find user by ID
  async findById(id: number): Promise<User> {
    const user = await this.userModel.scope('withoutPassword').findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, is_deleted: false },
    });
  }

  // Get all users (admin only)
  async findAll(): Promise<User[]> {
    return await this.userModel.scope('withoutPassword').findAll({
      where: { is_deleted: false },
    });
  }
}
