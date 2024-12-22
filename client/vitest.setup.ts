import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables before each test
vi.stubEnv('VITE_SUPABASE_URL', 'http://localhost:3000');
vi.stubEnv('VITE_SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9penZveG9jdG96dXNvYWh4am9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzI5ODYsImV4cCI6MjA0NjM0ODk4Nn0.C1pb4SPi3Ne0aOMd-amYNPG2w-agTdo5qqRG7hFAj5A');
