import Link from 'next/link'
import Wrapper from '../Wrapper'
import { auth } from '@/auth'

const Navbar = async () => {
  const session = await auth()

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b bg-white/55 backdrop-blur-lg transition-all'>
      <Wrapper>
        <div className='flex h-14 items-center justify-between'>
          <Link href='/' className='font-semibold font-mono text-xl'>
            FitBox
          </Link>

          <div className='flex'>
            <div className='flex items-center'>
              {session?.user.id ? (
                <div className='min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full border border-gray-500 flex justify-center items-center'>
                  {session?.user.image ? (
                    <img src={session?.user?.image || 'User'}
                      width={32}
                      height={32}
                      alt="User Avatar"
                      className='rounded-full object-contain'
                    />
                  ) : (
                    <p className='rounded-full w-[32px] h-[32px] flex justify-center items-center bg-black text-white'>
                      {typeof session?.user?.name === 'string' ? session.user.name[0] : 'U'}
                    </p>
                  )}
                </div>
              ) : (
                <Link href="/sign-in" className='px-8 py-2 rounded-full border hover:bg-black hover:text-white transition duration-500'>
                  Sign in
                </Link>
              )
              }
            </div>
          </div>
        </div>
      </Wrapper>
    </nav>
  )
}

export default Navbar
