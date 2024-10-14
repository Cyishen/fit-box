"use client"

import Link from 'next/link'
import Wrapper from '../Wrapper'
// import { Button } from '../ui/button'
// import MobileMenu from '../MobileMenu';

// import { Loader } from "lucide-react";
// import { 
//   ClerkLoaded, 
//   ClerkLoading,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
//   useAuth,
// } from "@clerk/nextjs";


const Navbar = () => {
  // const { isSignedIn } = useAuth();

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b bg-white/55 backdrop-blur-lg transition-all'>
      <Wrapper>
        <div className='flex h-14 items-center justify-between'>
          <Link href='/' className='font-semibold font-mono text-xl'>
            FitBox
          </Link>

          <div className='flex'>
            <div className='flex items-center'>
              <Link href="/sign-in" className='px-8 py-2 rounded-full border hover:bg-black hover:text-white transition duration-500'>
                Sign in
              </Link>
            </div>
          </div>

          {/* <div className="flex items-center justify-center gap-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/"
                  signUpFallbackRedirectUrl="/"
                  signUpForceRedirectUrl="/"
                >
                  <Button size="sm" variant="ghost">
                    登入
                  </Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>

            <MobileMenu />
          </div> */}
        </div>
      </Wrapper>
    </nav>
  )
}

export default Navbar
