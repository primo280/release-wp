import { exit } from "process"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { s3Client as _s3Client } from "@/lib/s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { chunk, logger } from "@djalon/lib"
import { Prisma } from "@prisma/client"

const clearUnusedUploads = async () => {
  const now = new Date()

  if (!env.ENABLE_S3_SERVICE || !_s3Client) {
    throw new Error("S3 service is disabled")
  }
  const s3Client = _s3Client

  //* Uploading files that are expired
  // Step 1: Find all uploading files that are expired
  const expiredUploadingFiles = await prisma.fileUploading.findMany({
    where: {
      expires: {
        lte: now,
      },
    },
    include: {
      file: true,
    },
  })
  if (!expiredUploadingFiles.length) {
    logger.debug(`No expired uploading files found`)
  } else {
    logger.debug(`Found ${expiredUploadingFiles.length} expired uploading files`)
    const chuked = chunk(expiredUploadingFiles, 100)
    const deletedFiles: string[] = []

    await Promise.all(
      chuked.map(async (files) => {
        // Step 2: Delete the expired uploading files from S3
        const deleted: string[] = []
        deleted.push(...files.filter((file) => file.file).map((file) => file.id))
        await Promise.all(
          files
            // Only delete the files that are not linked to any item
            .filter((file) => !file.file)
            .map(async (file) => {
              const command = new DeleteObjectCommand({
                Bucket: file.bucket,
                Key: file.key,
              })
              const res = await s3Client.send(command).catch((e) => {
                logger.error(e)
                return null
              })
              if (res) {
                deleted.push(file.id)
              }
            })
        )
        // Step 3: Delete the expired uploading files from db
        await prisma.fileUploading.deleteMany({
          where: {
            id: {
              in: deleted,
            },
          },
        })
        deletedFiles.push(...deleted)
      })
    )
    logger.debug(`Deleted ${deletedFiles.length} expired uploading files`)
  }

  //* Delete already uploaded files that are not linked to any item
  // Step 1: Find all uploaded files that are not linked to any item
  const knownWhereFields = [
    "AND",
    "NOT",
    "OR",
    "id",
    "key",
    "bucket",
    "endpoint",
    "filetype",
    "fileUploading",
    "fileUploadingId",
    "createdAt",
    "updatedAt",
  ] as const
  type TToHandleBase = Omit<Prisma.FileWhereInput, (typeof knownWhereFields)[number]>
  type TToHandleRequired = {
    [K in keyof TToHandleBase]-?: TToHandleBase[K]
  }
  const where: TToHandleRequired[] = [
    {
      userProfilePicture: {
        is: null,
      },
    },
  ]
  //? Show error if there is any field in Prisma.FileWhereInput that is not in knownWhereFields/where
  const unlikedFiles = await prisma.file.findMany({
    where: {
      OR: where,
    },
  })
  if (!unlikedFiles.length) {
    logger.debug(`No unlinked files found`)
  } else {
    logger.debug(`Found ${unlikedFiles.length} unlinked files`)
    const chuked = chunk(unlikedFiles, 100)
    const deletedFiles: string[] = []

    await Promise.all(
      chuked.map(async (files) => {
        // Step 2: Delete the unlinked files from S3
        const deleted: string[] = []
        await Promise.all(
          files.map(async (file) => {
            const command = new DeleteObjectCommand({
              Bucket: file.bucket,
              Key: file.key,
            })
            const res = await s3Client.send(command).catch((e) => {
              logger.error(e)
              return null
            })
            if (res) {
              deleted.push(file.key)
            }
          })
        )
        // Step 3: Delete the unlinked files from db
        await prisma.file.deleteMany({
          where: {
            id: {
              in: files.filter((file) => deleted.includes(file.key)).map((file) => file.id),
            },
          },
        })
        deletedFiles.push(...deleted)
      })
    )
    logger.debug(`Deleted ${deletedFiles.length} unlinked files`)
  }
}

const main = async () => {
  const maxDurationWarning = 1000 * 60 * 5 // 5 minutes
  const name = "ClearUnusedUploads"
  const now = new Date()

  logger.prefix = () => `[${new Date().toLocaleString()}] `
  await clearUnusedUploads().catch((err) => {
    logger.error(
      `${name} started at ${now.toLocaleString()} and failed after ${new Date().getTime() - now.getTime()}ms`
    )
    throw err
  })
  const took = new Date().getTime() - now.getTime()
  if (took > maxDurationWarning) logger.warn(`${name} took ${took}ms`)

  exit(0)
}

main()
