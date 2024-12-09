// generator client {
//   provider = "prisma-client-js"
// }

// // prisma/schema.prisma
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

// model Account {
//   id                String  @id @default(cuid())
//   userId            String  @map("user_id")
//   type              String
//   provider          String
//   providerAccountId String  @map("provider_account_id")
//   refresh_token     String? @db.Text
//   access_token      String? @db.Text
//   expires_at        Int?
//   token_type        String?
//   scope             String?
//   id_token          String? @db.Text
//   session_state     String?

//   user User @relation(fields: [userId], references: [id], onDelete: Cascade)

//   @@unique([provider, providerAccountId])
//   @@map("accounts")
// }

// enum UserRole {
//   ADMIN
//   USER
// }

// model User {
//   id             String    @id @default(cuid())
//   name           String? // 姓名
//   email          String?   @unique // 電子郵件
//   emailVerified  DateTime? @map("email_verified")
//   image          String? // 頭像 URL
//   password       String? // 密碼
//   role           UserRole  @default(USER)
//   dateOfBirth    DateTime? // 出生日期
//   createdAt      DateTime  @default(now()) // 用戶創建時間
//   updatedAt      DateTime  @updatedAt // 最近更新時間
//   lastActiveDate DateTime? // 最近活躍時間

//   menu             Menu[]
//   workoutSessions  WorkoutSession[] // 用戶的訓練紀錄
//   workoutSummaries WorkoutSummary[] // 統計動作, 方便查詢
//   accounts         Account[] // 與用戶相關的帳戶

//   @@map("users")
// }

// model Menu {
//   id     String @id @default(cuid())
//   userId String @map("user_id")
//   title  String

//   user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
//   templates      Template[]
//   workoutSession WorkoutSession[]
//   isDeleted      Boolean          @default(false)
// }

// model Template {
//   id               String @id @default(cuid())
//   menuId           String @map("menu_id")
//   templateTitle    String @map("templateTittle")
//   templateCategory String

//   exercises      Exercise[]
//   workoutSession WorkoutSession[]
//   menu           Menu             @relation(fields: [menuId], references: [id], onDelete: Cascade)
//   isDeleted      Boolean          @default(false)
// }

// // TODO*訓練記錄
// model WorkoutSession {
//   id            String    @id @default(cuid())
//   cardSessionId String    @unique
//   userId        String    @map("user_id")
//   menuId        String    @map("menu_id")
//   templateId    String    @map("template_id")
//   templateTitle String    @map("template_title")
//   date          DateTime // 訓練日期
//   startTime     DateTime? // 開始時間
//   endTime       DateTime? // 結束時間
//   notes         String?

//   exercises        Exercise[]
//   workoutSummaries WorkoutSummary[]

//   user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//   menu    Menu     @relation(fields: [menuId], references: [id])
//   tempate Template @relation(fields: [templateId], references: [id])
// }

// // 動作模型
// model Exercise {
//   id               String @id @default(cuid())
//   movementId       String // 固定的動作ID，例如啞鈴胸推 1, 划船 2)
//   name             String
//   exerciseCategory String

//   sets             Set[]
//   workoutSessionId String?
//   workoutSession   WorkoutSession? @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)

//   templateId String
//   template   Template @relation(fields: [templateId], references: [id], onDelete: Cascade)

//   @@index([movementId]) // 創建索引，提升查詢效率
// }

// // 組數模型
// model Set {
//   id          String @id @default(cuid()) // 組數唯一ID
//   movementId  String // 這裡直接儲存 Exercise 的固定動作ID（如啞鈴胸推的 ID 為 1）
//   leftWeight  Float // 左側重量
//   rightWeight Float // 右側重量
//   repetitions Int // 重複次數
//   totalWeight Float // 總重量

//   exerciseId String
//   exercise      Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

//   @@index([movementId])
// }

// // TODO*統計
// // 範例說明
// // 假設昨天的訓練如下：
// // 啞鈴胸推: 5 組，每組 10 下，每下 5 公斤。總重量：250 公斤
// // 肩推: 3 組，每組 12 下，每下 4 公斤。總重量：144 公斤

// // 當天總組數 5（啞鈴胸推） + 3（肩推） = 8 組
// // 當天總重量  250（啞鈴胸推） + 144（肩推） = 394 公斤
// model WorkoutSummary {
//   id                 String            @id @default(cuid())
//   userId             String            @map("user_id")
//   workoutSessionId   String            @unique @map("WorkoutSession_id")
//   date               DateTime
//   totalSessionSets   Int
//   totalSessionWeight Float
//   exerciseSummary    ExerciseSummary[]

//   user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)
//   workoutSession WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)

//   @@map("workout_summaries")
// }

// // 顯示個別動作組數與重量 
// // 啞鈴胸推: 5 組。總重量：250 公斤
// // 肩推: 3 組。總重量：144 公斤
// model ExerciseSummary {
//   id             String @id @default(cuid())
//   movementId     String
//   movementName   String
//   movementSets   Int
//   movementWeight Float

//   workoutSummaryId String         @map("workout_summary_id")
//   workoutSummary   WorkoutSummary @relation(fields: [workoutSummaryId], references: [id], onDelete: Cascade)

//   @@unique([movementId, workoutSummaryId])
//   @@index([movementId])
//   @@map("exercise_summaries")
// }
