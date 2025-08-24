import { PrismaClient } from '@prisma/client';

// Mock Prisma for testing
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    video: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Global test utilities
global.beforeEach(() => {
  jest.clearAllMocks();
});

global.afterAll(async () => {
  // Cleanup any test data
}); 