import { ref, uploadBytes, getDownloadURL, UploadResult, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export type StorageFile = UploadResult['metadata'] & {
  url: string
}

const uploadFile = async (file: File, name: string): Promise<StorageFile> => {
  const fileName = name ?? file.name
  const fileRef = ref(storage, fileName)

  const uploadedImage = await uploadBytes(fileRef, file)
  const url = await getDownloadURL(uploadedImage.ref)

  return {
    ...uploadedImage.metadata,
    url,
  }
}

const deleteFile = async (fileName: string): Promise<void> => {
  const fileRef = ref(storage, fileName)
  await deleteObject(fileRef)
}

export const FileService = { uploadFile, deleteFile }
