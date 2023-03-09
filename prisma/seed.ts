import { db } from '../src/common/db'
import { user } from './seeds/users'

const main = async () => {
    console.log('🌱  Start Seeding...\n')
    const userCreated = await db.user.create({
        data: user,
    })
    console.log({ userCreated })
    console.log('\n🌱  We got this far, apparently without any problems...\n')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
