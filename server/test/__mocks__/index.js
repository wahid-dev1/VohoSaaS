module.exports = {
  sequelize: { close: jest.fn() },
  Tenant: {
    create: jest.fn().mockResolvedValue({ id: 1, slug: 'acme', name: 'Acme Inc' }),
    findOne: jest.fn().mockResolvedValue({ id: 1, slug: 'acme', name: 'Acme Inc' }),
  },
  User: {
    create: jest.fn().mockResolvedValue({ id: 1, email: 'admin@acme.com', role: 'admin' }),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      email: 'admin@acme.com',
      role: 'admin',
      passwordHash: 'hashedPass'
    }),
  }
};
