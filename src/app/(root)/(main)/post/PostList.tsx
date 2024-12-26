import React from 'react'
import DCard, { DCardProps } from './DCard'

export const FakeCardData: DCardProps[] = [
  {
    id: 'post1',
    userId: 'a1', 
    userName: 'user1',
    isAnonymous: true,
    gender: 'male',
    userImage: '/icons/',
    title: '測試標題1 高蛋白飲食',
    content: '內文測試內文測試內文測試內文測試內文測試內文測試內文測試內文測試',
    contentImage: [
      '/posts/post2.jpeg',
      '/posts/post1.jpeg',
    ],
    like: 14,
    comment: 1,
    bookmark: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['蛋白質', '雞蛋'],
    comments: [
      {
        id: 'B1',
        userId: 'a1',
        userName: 'cyi',
        userImage: '/icons/',
        isAnonymous: false,
        gender: 'male',
        content: '回覆內文1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'B2',
        userId: 'a2',
        userName: 'Lin',
        userImage: '/icons/',
        isAnonymous: false,
        gender: 'female',
        content: '回覆內文2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'post2',
    userId: 'a1',
    userName: 'user2',
    isAnonymous: false,
    gender: 'female',
    userImage: '/icons/',
    title: '測試標題2 乳清推薦',
    content: '內文測試',
    contentImage: [
      '/posts/post1.jpeg',
    ],
    like: 16,
    comment: 1,
    bookmark: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['乳清', '蛋白質'],
    comments: [
      {
        id: 'B1',
        userId: 'a1',
        userName: 'user1',
        userImage: '/icons/',
        isAnonymous: false,
        gender: 'male',
        content: '回覆內文',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'post3',
    userId: 'a1',
    userName: 'user2',
    isAnonymous: false,
    gender: 'female',
    userImage: '/icons/',
    title: '測試標題2 乳清推薦',
    content: '內文測試',
    contentImage: [
    ],
    like: 16,
    comment: 1,
    bookmark: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['tag3', 'tag2'],
    comments: [
      {
        id: 'B1',
        userId: 'a1',
        userName: 'user1',
        userImage: '/icons/',
        isAnonymous: false,
        gender: 'male',
        content: '回覆內文',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
]


const PostList = () => {
  return (
    <div className='flex h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-3xl sm:border-[0.5px] custom-scrollbar mb-16 sm:mb-[76px]'>
      <div className='flex flex-col w-full sm:rounded-t-3xl'>
        {FakeCardData.map((data) => (
          <div key={data.id}>
            <DCard {...data}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList