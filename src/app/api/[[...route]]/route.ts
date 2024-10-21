import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { zValidator } from '@hono/zod-validator'
import { authFormSchema } from '@/lib/utils'

import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

// export const runtime = 'edge'
const app = new Hono().basePath('/api')

const fakeUsers = [
  { name: 'Cyi', email: 'test@gmail.com', password: '123' }
];

const auth = new Hono()
  .get('/session', (c) => {
    const cookie = getCookie(c, "fit-user-session")

    if (cookie) {
      const userData = JSON.parse(Buffer.from(cookie, 'base64').toString())
      return c.json({ isSignedIn: true, userData })
    } else {
      return c.json({ isSignedIn: false, userData: null }, 200)
    }
  })
  .post('/sign-in',
    zValidator('json', authFormSchema('sign-in')),
    (c) => {
      const { email, password } = c.req.valid('json');

      const user = fakeUsers.find(user => user.email === email && user.password === password);

      if (user) {
        const session = JSON.stringify({
          email: user.email,
          name: user.name,
          date: new Date().toISOString().slice(0, 10),
        });

        const encodedSessionSecret = Buffer.from(session).toString('base64');

        setCookie(c, "fit-user-session", encodedSessionSecret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 60 * 60 * 24 * 30,
        })

        return c.json({ email, name: user.name }, 200);
      } else {
        return c.json({ message: '無效的電子郵件或密碼' }, 401);
      }
    }
  )
  .post('/sign-up',
    zValidator('json', authFormSchema('sign-up')),
    (c) => {
      const { name, email, password } = c.req.valid('json');

      if (fakeUsers.some(user => user.email === email)) {
        return c.json({ message: '此電子郵件已被註冊' }, 400);
      }

      if (name && email && password) {
        fakeUsers.push({ name, email, password });
        return c.json({ message: '註冊成功', name, email }, 200);
      } else {
        return c.json({ message: '註冊資料不完整' }, 400);
      }
    }
  )
  .post('/logout', (c) => {
    deleteCookie(c, "fit-user-session", { path: '/' });

    return c.json({ success: true });
  });

// const project = new Hono()
//   .get('/project/:projectId', (c) => {
//     const { projectId } = c.req.param();
//     return c.json({ project: projectId });
//   });

const routes = app
  .route('/hono', auth)
// .route('/', project)


// TODO* method
export const GET = handle(routes)
export const POST = handle(routes)

// todo* RPC code (lib folder)
export type AppType = typeof routes;