import bcrypt from 'bcrypt'

export const user = {
  email: 'sosnoski.mao@gmail.com',
  password: bcrypt.hashSync('12345678', 12),
  slug: 'fernando-sosnoski',
  name: 'Fernando Sosnoski',
  role: 'Suporte Técnico',
  firstName: 'Fernando',
  avatar: '/images/fernando.jpg',
  video: '/videos/fernando.mp4',
  bio: `Consequat aliqua excepteur in aliquip commodo cillum qui laboris laborum minim eu exercitation. Proident do velit consectetur \
    aute laboris eiusmod consequat ex sint irure exercitation duis cupidatat. Adipisicing labore minim elit amet non \
    proident incididunt aliquip esse pariatur cillum reprehenderit. Amet exercitation tempor in adipisicing id irure \
    deserunt deserunt nostrud nisi et qui aute. Ipsum eu quis esse veniam. Cillum id ullamco voluptate excepteur \
    exercitation veniam commodo cillum ipsum Lorem culpa ullamco elit. Non ex elit duis do sunt ad irure nisi minim \
    incididunt ullamco. Do et magna labore cupidatat dolor labore qui qui nostrud ex nisi exercitation irure. Aliquip \
    in amet enim do. Elit veniam esse dolor esse eu tempor exercitation. Deserunt irure enim ipsum elit aute esse qui \
    nisi eiusmod sint. Dolor dolor voluptate proident elit do minim sunt sit aliquip adipisicing pariatur in in. Culpa \
    occaecat tempor commodo labore sunt incididunt do exercitation veniam culpa laboris aute magna quis. Nostrud eu \
    laboris aliquip laborum nisi nisi. Ipsum irure esse eiusmod consequat sint. Proident et et minim magna ex sint \
    occaecat reprehenderit irure occaecat adipisicing non sint esse.`,
  active: true,
  admin: true,
}
