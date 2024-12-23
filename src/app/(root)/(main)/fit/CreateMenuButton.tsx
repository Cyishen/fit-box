"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'


const CreateMenuButton = () => {
  // const [randomBoxImage, setRandomBoxImage] = useState<string>('');

  // useEffect(() => {
  //   const images = [
  //     '/imgs/cap.png',
  //     '/imgs/hulk.png',
  //     '/imgs/iron.png',
  //     '/imgs/thor.png',
  //     '/imgs/girl.png',
  //   ];
  //   const randomIndex = Math.floor(Math.random() * images.length);
  //   const randomImage = images[randomIndex];
  //   setRandomBoxImage(randomImage);
  // }, []);

  return (
    <div
      className='flex items-center justify-between w-full py-3'
    // style={{
    //   backgroundImage: `url(${randomBoxImage})`,
    //   backgroundSize: 'contain',
    //   backgroundPosition: 'center',
    //   backgroundRepeat: 'repeat',
    //   backgroundBlendMode: 'overlay',
    //   backgroundColor: '#f3f4f6',
    // }}
    >
      <h1 className='font-bold'>訓練盒</h1>

      <Link href='/fit/create-menu'>
        <Button
          size='sm'
          className='w-fit self-end hover:bg-white hover:text-black'
        >
          + 新盒子
        </Button>
      </Link>
    </div>
  )
}

export default CreateMenuButton