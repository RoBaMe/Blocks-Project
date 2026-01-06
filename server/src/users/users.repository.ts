import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

interface DatabaseData {
    users: User[];
}

@Injectable()
export class UsersRepository implements OnModuleInit {
    private readonly dataFilePath = join(process.cwd(), 'data', 'db.json');
    private db: Low<DatabaseData>;

    async onModuleInit() {
        await this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        const adapter = new JSONFile<DatabaseData>(this.dataFilePath);
        this.db = new Low<DatabaseData>(adapter, { users: [] });

        await this.db.read();

        if (!this.db.data) {
            this.db.data = { users: [] };
            await this.db.write();
        }
    }

    private get users(): User[] {
        return this.db.data?.users || [];
    }

    async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        const newUser: User = {
            ...user,
            id: uuidv4(),
            createdAt: new Date(),
        };

        this.db.data.users.push(newUser);
        await this.db.write();
        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find((user) => user.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find((user) => user.id === id) || null;
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }
}
