import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Dede tips',
            email: 'dedetips@gmail.com',
            avatarUrl: 'http://github.com/andredalpisol.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example pool',
            code: 'BOL123',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    const game = await prisma.game.create({
        data: {
            date: '2022-11-02T12:00:00.713Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'

        }
    })

    const game2 = await prisma.game.create({
        data: {
            date: '2022-11-11T12:00:00.713Z',
            firstTeamCountryCode: 'AR',
            secondTeamCountryCode: 'BR',
            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })



}

main()