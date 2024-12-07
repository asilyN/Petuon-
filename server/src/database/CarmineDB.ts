
import { Pool } from 'pg';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

export const router = express.Router();

export const pool = new Pool({
    host: process.env.PG_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
    port: parseInt(process.env.PG_PORT || "6543"),
    database: process.env.PG_DATABASE || "postgres",
    user: process.env.PG_USER || "postgres.oizvoxoctozusoahxjos",
    password: process.env.PG_PASSWORD || "Carmine_123456789!!!",
});
