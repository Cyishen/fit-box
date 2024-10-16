import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { zValidator } from '@hono/zod-validator'
import { authFormSchema } from '@/lib/utils'


export const runtime = 'edge'
const app = new Hono().basePath('/api')

const fakeUsers = [
  { name: 'Test User', email: 'test@gmail.com', password: '123' }
];

const auth = new Hono()
  .get('/users', (c) => {
    const safeUsers = fakeUsers.map(({ name, email }) => ({ name, email }));
    return c.json(safeUsers);
  })
  .post(
    '/sign-in',
    zValidator('json', authFormSchema('sign-in')),
    (c) => {
      const { email, password } = c.req.valid('json');

      const user = fakeUsers.find(user => user.email === email && user.password === password);

      if (user) {
        return c.json({ email, name: user.name }, 200);
      } else {
        return c.json({ message: '無效的電子郵件或密碼' }, 401);
      }
    }
  )
  .post(
    '/sign-up',
    zValidator('json', authFormSchema('sign-up')),
    (c) => {
      const { name, email, password } = c.req.valid('json');

      if (fakeUsers.some(user => user.email === email)) {
        return c.json({ message: '此電子郵件已被註冊' }, 400);
      }

      if (name && email && password) {
        fakeUsers.push({ name, email, password });
        return c.json({ message: '註冊成功', name, email }, 201);
      } else {
        return c.json({ message: '註冊資料不完整' }, 400);
      }
    }
  )

// const project = new Hono()
//   .get('/project/:projectId', (c) => {
//     const { projectId } = c.req.param();
//     return c.json({ project: projectId });
//   });

const routes = app
  .route('/auth', auth)
// .route('/', project)


// TODO* method
export const GET = handle(routes)
export const POST = handle(routes)

// todo* RPC code (lib folder)
export type AppType = typeof routes;