export const insertTextIntoFileName = (fileName: string, textToInsert: string) => {
  const namePartsSplitOnDot = fileName.split('.')
  const extension = namePartsSplitOnDot.pop()
  const originalFileName = namePartsSplitOnDot.join('.')
  return `${originalFileName}${textToInsert}.${extension}`
}
