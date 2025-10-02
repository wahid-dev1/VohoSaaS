const { buildTestApp } = require('./testApp');

test('app builds without crashing', async () => {
  const app = await buildTestApp();
  expect(app).toBeTruthy();
  expect(typeof app.use).toBe('function'); // Express app has .use
});
