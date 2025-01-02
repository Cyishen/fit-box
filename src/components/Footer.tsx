import Image from "next/image";
import { Button } from "./ui/button";
import Wrapper from "./Wrapper";

export const footerLinks = [
  "隱私權政策",
  "使用條款",
  "銷售及退款",
  "法律聲明",
  "網站地圖",
];

const Footer = () => {

  return (
    <footer className="relative py-5 mt-16 bg-gray-50">
      <Wrapper>
        <div className="flex flex-col md:flex-row justify-between gap-14">
          <div className="w-full md:w-1/3">
            <p className="font-mono font-extrabold">Logo here</p>

            <br />

            <p className="font-mono">write something here.</p>

            <div className="bg-gray-300 h-[1px] my-8" />

            <p className="font-mono">Get The Latest News</p>

            <div className="flex items-center justify-between mt-5 h-10">
              <input
                type="text"
                placeholder="Email"
                className="w-full h-full px-3 py-2 text-base border rounded-l-md font-mono focus-visible:outline-none focus-visible:border-sky-400 focus-visible:border-2"
              />
              <Button className="rounded-none text-sm font-mono rounded-r-md h-full">Submit</Button>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <div className="flex flex-row gap-3">
                <Image
                  src="/media/twitter.svg"
                  alt="logo"
                  width={30}
                  height={30}
                  className="cursor-pointer p-0.5 rounded-sm transition-all"
                />
                <Image
                  src="/media/youtube.svg"
                  alt="logo"
                  width={30}
                  height={30}
                  className="cursor-pointer p-0.5 rounded-sm transition-all"
                />
                <Image
                  src="/media/fb.svg"
                  alt="logo"
                  width={30}
                  height={30}
                  className="cursor-pointer p-0.5 rounded-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-2/3">
            <div>
              <p className="font-mono font-bold">
                Product
              </p>
              <ul className="flex flex-col gap-2 mt-5 font-mono">
                <p>Pricing</p>
                <p>Features</p>
                <p>How It Works</p>
              </ul>
            </div>

            <div>
              <p className="font-mono font-bold">
                About Us
              </p>
              <ul className="flex flex-col gap-2 mt-5 font-mono">
                <p>About</p>
                <p>Blog</p>
                <p>Our Team</p>
                <p>Newsroom</p>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 mt-8 md:mt-0">
              <div>
                <p className="font-mono font-bold">
                  Support
                </p>
                <ul className="flex flex-col gap-2 mt-5 font-mono">
                  <p>Your Account</p>
                  <p>Support Center</p>
                  <p>Community</p>
                  <p>Help & FAQ</p>
                </ul>
              </div>

              <div className="mt-8">
                <p className="font-mono font-bold">
                  Contact Us
                </p>
                <ul className="flex flex-col gap-2 mt-5 font-mono">
                  <div className="flex items-center gap-2">
                    <span>+886 123-456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Service@gmail.com</span>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full mt-10 flex flex-col md:flex-row md:gap-8">
          <div className="flex items-center gap-1.5">
            <p className='text-muted-foreground font-mono text-xl'>
              &copy;
            </p>
            <p className='text-muted-foreground font-mono text-xs'>
              {new Date().getFullYear()} FitBox.
            </p>
          </div>

          <div className="flex items-center">
            {footerLinks.map((link, i) => (
              <p key={link} className="text-muted-foreground text-xs">
                {link}

                {i !== footerLinks.length - 1 && (
                  <span className="mx-1"> | </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer