import React from 'react'
import DCard, { DCardProps } from './DCard'

export const generateFakeCardData = (): DCardProps[] => {
  const generateCommentId = (index: number) => `B${index + 1}`;
  const generateReplayId = (commentId: string, index: number) => `${commentId}-${index + 1}`;

  return [
    {
      id: 'post1',
      userId: 'a1',
      userName: 'user1',
      isAnonymous: true,
      gender: 'male',
      userImage: '/icons/',
      title: '測試標題1 高蛋白飲食',
      content: '內文測試內文測試內文測試內文測試內文測試內文測試內文測試內文測試',
      contentImage: ['/posts/post2.jpeg', '/posts/post1.jpeg'],
      like: 14,
      bookmark: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['蛋白質', '雞蛋'],
      comments: [
        {
          id: generateCommentId(0),
          userId: 'a1',
          userName: 'cyi',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '留言1',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: [
            {
              id: generateReplayId('B1', 0),
              userId: 'a1',
              userName: 'cyi',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 1),
              userId: 'a2',
              userName: 'Rose',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'female',
              content: '回覆留言2',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: generateCommentId(1),
          userId: 'a2',
          userName: 'Lin',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'female',
          content: '留言2',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: [
            {
              id: generateReplayId('B1', 0),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        },
      ],
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
      bookmark: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['乳清', '蛋白質'],
      comments: [
        {
          id: generateCommentId(0),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        }
      ]
    },
    {
      id: 'post3',
      userId: 'a1',
      userName: 'user2',
      isAnonymous: false,
      gender: 'male',
      userImage: '/icons/',
      title: '測試標題2 乳清推薦',
      content: '內文測試',
      contentImage: [
      ],
      like: 16,
      bookmark: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['tag3', 'tag2'],
      comments: [
        {
          id: generateCommentId(0),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: [
            {
              id: generateReplayId('B1', 0),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 1),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言2',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 2),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 3),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 4),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 5),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 6),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 7),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 8),
              userId: 'a1',
              userName: 'Cyi2',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: generateReplayId('B1', 9),
              userId: 'a1',
              userName: 'Cyi9',
              userImage: '/icons/',
              isAnonymous: false,
              gender: 'male',
              content: '回覆留言3',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        },
        {
          id: generateCommentId(1),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        },
        {
          id: generateCommentId(2),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        },
        {
          id: generateCommentId(3),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        },
        {
          id: generateCommentId(4),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        },
        {
          id: generateCommentId(5),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        },
        {
          id: generateCommentId(6),
          userId: 'a1',
          userName: 'user1',
          userImage: '/icons/',
          isAnonymous: false,
          gender: 'male',
          content: '回覆內文',
          createdAt: new Date(),
          updatedAt: new Date(),
          replays: []
        }
      ]
    },
  ];
};


// export const FakeCardData: DCardProps[] = [
//   {
//     id: 'post1',
//     userId: 'a1',
//     userName: 'user1',
//     isAnonymous: true,
//     gender: 'male',
//     userImage: '/icons/',
//     title: '測試標題1 高蛋白飲食',
//     content: '內文測試內文測試內文測試內文測試內文測試內文測試內文測試內文測試',
//     contentImage: [
//       '/posts/post2.jpeg',
//       '/posts/post1.jpeg',
//     ],
//     like: 14,
//     bookmark: 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     tags: ['蛋白質', '雞蛋'],
//     comments: [
//       {
//         id: 'B1',
//         userId: 'a1',
//         userName: 'cyi',
//         userImage: '/icons/',
//         isAnonymous: false,
//         gender: 'male',
//         content: '留言1',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         replays: [
//           {
//             id: `${'B1'}-1`,
//             userId: 'a1',
//             userName: 'cyi',
//             userImage: '/icons/',
//             isAnonymous: false,
//             gender: 'male',
//             content: '回覆留言1',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           }
//         ]
//       },
//       {
//         id: 'B2',
//         userId: 'a2',
//         userName: 'Lin',
//         userImage: '/icons/',
//         isAnonymous: false,
//         gender: 'female',
//         content: '留言2',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }
//     ]
//   },
//   {
//     id: 'post2',
//     userId: 'a1',
//     userName: 'user2',
//     isAnonymous: false,
//     gender: 'female',
//     userImage: '/icons/',
//     title: '測試標題2 乳清推薦',
//     content: '內文測試',
//     contentImage: [
//       '/posts/post1.jpeg',
//     ],
//     like: 16,
//     bookmark: 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     tags: ['乳清', '蛋白質'],
//     comments: [
//       {
//         id: 'B1',
//         userId: 'a1',
//         userName: 'user1',
//         userImage: '/icons/',
//         isAnonymous: false,
//         gender: 'male',
//         content: '回覆內文',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }
//     ]
//   },
//   {
//     id: 'post3',
//     userId: 'a1',
//     userName: 'user2',
//     isAnonymous: false,
//     gender: 'male',
//     userImage: '/icons/',
//     title: '測試標題2 乳清推薦',
//     content: '內文測試',
//     contentImage: [
//     ],
//     like: 16,
//     bookmark: 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     tags: ['tag3', 'tag2'],
//     comments: [
//       {
//         id: 'B1',
//         userId: 'a1',
//         userName: 'user1',
//         userImage: '/icons/',
//         isAnonymous: false,
//         gender: 'male',
//         content: '回覆內文',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]
//   },
// ]


const PostList = () => {
  const fakeData = generateFakeCardData()

  return (
    <div className='flex h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-3xl sm:border-[0.5px] custom-scrollbar mb-16 sm:mb-[76px]'>
      <div className='flex flex-col w-full sm:rounded-t-3xl'>
        {fakeData.map((data) => (
          <div key={data.id}>
            <DCard {...data} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList